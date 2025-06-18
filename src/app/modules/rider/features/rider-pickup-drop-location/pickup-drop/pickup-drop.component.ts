import { Component, OnInit } from '@angular/core';
import { PickupDropApiService } from './pickup-drop-api.service';
import { PickupDropModel } from './pickup-drop-model';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';
import { GeocodeService } from 'src/app/core/services/geocode/geocode.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-pickup-drop',
  templateUrl: './pickup-drop.component.html',
  styleUrls: ['./pickup-drop.component.css'],
})
export class PickupDropComponent implements OnInit {
  pickupLocationText: string = '';
  dropLocationText: string = '';
  pickupCoords: { longitude: number; latitude: number } | null = null;
  dropCoords: { longitude: number; latitude: number } | null = null;
  inputMethod: 'manual' | 'map' = 'manual';
  mapApplyOnPickUpYaDrop: 'pickup' | 'drop' = 'pickup';
  locationText: string = '';
  addressSuggestions: string[] = [];
  bookingData: PickupDropModel;
  private searchSubject = new Subject<{
    type: 'pickup' | 'drop';
    text: string;
  }>();
  constructor(
    private geocodeService: GeocodeService,
    private pickupDropApiService: PickupDropApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.searchSubject
    //   .pipe(
    //     debounceTime(300),
    //     distinctUntilChanged((prev, curr) => prev.text === curr.text),
    //     switchMap(({ type, text }) =>
    //       text
    //         ? this.geocodeService.getSuggestions(text).pipe(
    //             tap((suggestions) => {
    //               this.addressSuggestions = suggestions;
    //             }),
    //             switchMap(() => this.geocodeService.geocodeAddress(text)),
    //             tap((coords) => {
    //               if (type === 'pickup') {
    //                 this.pickupCoords = coords;
    //               } else {
    //                 this.dropCoords = coords;
    //               }
    //             })
    //           )
    //         : of(null)
    //     )
    //   )
    //   .subscribe();
  }

  onPickupFocus(): void {
    this.addressSuggestions = [];
    this.mapApplyOnPickUpYaDrop = 'pickup';
    this.inputMethod = 'manual';
  }

  onDropFocus(): void {
    this.addressSuggestions = [];
    this.mapApplyOnPickUpYaDrop = 'drop';
    this.inputMethod = 'manual';
  }

  onLocationTextChange(type: 'pickup' | 'drop', text: string): void {
    if (type === 'pickup') {
      this.pickupLocationText = text;
    } else {
      this.dropLocationText = text;
    }

    this.searchSubject.next({ type, text });
  }

  onButtonClick(): void {
    this.inputMethod = 'map';
    if (this.mapApplyOnPickUpYaDrop === 'drop') {
      this.locationText = this.dropLocationText;
    } else {
      this.locationText = this.pickupLocationText;
    }
  }

  onMapLocationSelected(event: {
    coords: { longitude: number; latitude: number };
    address: string;
  }) {
    if (this.mapApplyOnPickUpYaDrop === 'pickup') {
      this.pickupCoords = event.coords;
      this.pickupLocationText = event.address
        ? event.address
        : this.pickupLocationText;
    } else {
      this.dropCoords = event.coords ? event.coords : this.dropCoords;
      this.dropLocationText = event.address
        ? event.address
        : this.dropLocationText;
    }
    this.inputMethod = 'manual';
  }

  submitLocations() {
    if (!this.pickupCoords || !this.dropCoords) {
      alert('Please select both pickup and drop locations.');
      return;
    }

    this.bookingData = {
      PickUpLocationLatitude: this.pickupCoords.latitude,
      PickUpLocationLongitude: this.pickupCoords.longitude,
      DropLocationLatitude: this.dropCoords.latitude,
      DropLocationLongitude: this.dropCoords.longitude,
    };
    console.log(
      this.bookingData.PickUpLocationLatitude,
      this.bookingData.PickUpLocationLongitude,
      this.bookingData.DropLocationLatitude,
      this.bookingData.DropLocationLongitude
    );

    this.pickupDropApiService.storeLocation(this.bookingData).subscribe({
      next: (response) => {
        console.log('Success:', response);
        alert('Locations submitted');
        console.log('Saving to localStorage:', this.bookingData);
        localStorage.setItem(
          'pickupAndDropCoordinates',
          JSON.stringify(this.bookingData)
        );
        console.log(
          'Stored:',
          localStorage.getItem('pickupAndDropCoordinates')
        );
        this.router.navigate(['/RideConfirmation']);
      },
      error: (error) => {
        console.log('Error:', error);
      },
      complete: () => {
        console.log('Request complete');
      },
    });
  }
}
