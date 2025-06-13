import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
// import {  storeLocation } from 'src/app/services/location.service'
import { LocationService } from 'src/app/services/location.service';
import { Router } from '@angular/router';
import { GeocodingService } from 'src/app/services/geocoding-services.service';

@Component({
  selector: 'app-pickup-drop',
  templateUrl: './pickup-drop.component.html',
  styleUrls: ['./pickup-drop.component.css'],
})
export class PickupDropComponent {
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;
  map: Map;
  view: MapView;

  pickupInputMethod: 'text' | 'map' = 'text';
  dropInputMethod: 'text' | 'map' = 'text';

  pickupLocationText: string = '';
  dropLocationText: string = '';
  locationText: string = '';

  pickupCoords: { lat: number; lng: number } | null = null;
  dropCoords: { lat: number; lng: number } | null = null;

  pickupMarker: Graphic;
  dropMarker: Graphic;

  inputMethod: 'text' | 'map' = 'text';
  mapApplyOnPickUpYaDrop: 'pickup' | 'drop' = 'pickup';

  addressSuggestions: string[] = [
    'Connaught Place, Delhi',
    'India Gate, Delhi',
    'Rajiv Chowk, Delhi',
    'Gurgaon Sector 14',
    'Cyber City, Gurgaon',
  ];

  // ngAfterViewInit() {
  //   this.initMap();
  // }

  onPickupFocus(): void {
    this.inputMethod = 'text';
    this.mapApplyOnPickUpYaDrop = 'pickup';
  }
  onPickupBlur(value: string): void {
    this.onPickupTextChange(value).then(() => {
      console.log('change successfully', value);
    });
  }
  // onDropBlur(): void {
  //   this.onDropTextChange(this.dropLocationText).then(() => {
  //     console.log('change successfully');
  //   });
  // }

  onDropFocus(): void {
    this.inputMethod = 'text';
    this.mapApplyOnPickUpYaDrop = 'drop';

    console.log(this.mapApplyOnPickUpYaDrop);
  }

  onButtonClick(): void {
    this.inputMethod = 'map';
    if (this.mapApplyOnPickUpYaDrop === 'pickup') {
      this.locationText = this.pickupLocationText;
    } else {
      this.locationText = this.dropLocationText;
    }
  }
  // ngAfterViewInit() {
  //   this.initMap();
  // }

  // initMap() {
  //   this.map = new Map({
  //     basemap: 'streets-navigation-vector',
  //   });

  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       console.log(position);
  //       const latitude = position.coords.latitude;
  //       const longitude = position.coords.longitude;

  //       this.view = new MapView({
  //         container: this.mapViewEl.nativeElement,
  //         map: this.map,
  //         center: [longitude, latitude],
  //         zoom: 15,
  //       });

  //       console.log('console log');
  //       console.log(this.view);

  //       this.view.when(() => {
  //         if (this.mapApplyOnPickUpYaDrop === 'pickup') {
  //           this.setPickupLocation(longitude, latitude);
  //           this.getAddressFromCoordinates(latitude, longitude);
  //         } else {
  //           this.setDropLocation(longitude, latitude);
  //         }

  //         this.view.on('click', (event) => {
  //           const point = event.mapPoint;
  //           console.log(point);

  //           if (point.longitude != null && point.latitude != null) {
  //             if (
  //               this.pickupInputMethod === 'map' &&
  //               this.dropInputMethod !== 'map'
  //             ) {
  //               this.setPickupLocation(point.longitude, point.latitude);
  //               this.getAddressFromCoordinates(point.latitude, point.longitude);
  //             } else if (
  //               this.dropInputMethod === 'map' &&
  //               this.pickupInputMethod !== 'map'
  //             ) {
  //               this.setDropLocation(point.longitude, point.latitude);
  //             } else if (
  //               this.pickupInputMethod === 'map' &&
  //               this.dropInputMethod === 'map'
  //             ) {
  //               if (!this.pickupCoords) {
  //                 this.setPickupLocation(point.longitude, point.latitude);
  //                 this.getAddressFromCoordinates(
  //                   point.latitude,
  //                   point.longitude
  //                 );
  //               } else {
  //                 this.setDropLocation(point.longitude, point.latitude);
  //               }
  //             }
  //           }
  //         });
  //       });
  //     },
  //     (error) => {
  //       this.view = new MapView({
  //         container: this.mapViewEl.nativeElement,
  //         map: this.map,
  //         center: [77.209, 28.6139],
  //         zoom: 12,
  //       });
  //     }
  //   );
  // }

  setPickupLocation(lng: number, lat: number) {
    this.pickupCoords = { lat, lng };
    this.map = new Map({
      basemap: 'streets-navigation-vector',
    });

    if (this.pickupMarker) {
      this.view.graphics.remove(this.pickupMarker);
    }

    this.pickupMarker = new Graphic({
      geometry: new Point({ longitude: lng, latitude: lat }),
      symbol: {
        type: 'simple-marker',
        color: 'green',
        size: '14px',
      },
    });

    this.view.graphics.add(this.pickupMarker);
  }

  setDropLocation(lng: number, lat: number) {
    this.dropCoords = { lat, lng };
    if (this.dropMarker) {
      this.view.graphics.remove(this.dropMarker);
    }
    this.dropMarker = new Graphic({
      geometry: new Point({ longitude: lng, latitude: lat }),
      symbol: {
        type: 'simple-marker',
        color: 'red',
        size: '14px',
      },
    });
    this.view.graphics.add(this.dropMarker);
  }

  async getAddressFromCoordinates(lat: number, lng: number): Promise<void> {
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${lng},${lat}&f=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.address) {
        const address = data.address.Match_addr;
        console.log('Address:', address);
        if (this.mapApplyOnPickUpYaDrop === 'pickup') {
          this.pickupLocationText = address;
        } else {
          this.dropLocationText = address;
        }
      } else {
        console.warn('No address found');
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  }

  onTextChange(value: string) {
    if (value && value.length >= 3) {
      this.geocodingService.getSuggestions(value).subscribe((suggestions) => {
        this.addressSuggestions = suggestions;
      });
    } else {
      this.addressSuggestions = [];
    }
  }

  async onPickupTextChange(value: string): Promise<void> {
    this.pickupLocationText = value;
    console.log(value);

    if (!value.trim()) return;

    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&SingleLine=${encodeURIComponent(
      value
    )}&outFields=Match_addr,Addr_type&maxLocations=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('data => ', data);
      console.log(data.candidates);
      console.log(data.candidates.length);
      console.log(data.candidates[0].location.x);
      console.log(data.candidates[0].location.y);

      if (data.candidates && data.candidates.length > 0) {
        const location = data.candidates[0].location;
        const longitude: number = location.x;
        const latitude: number = location.y;
        console.log('sdgfd', longitude, latitude);

        console.log('Pickup Coordinates:', longitude, latitude);

        this.pickupCoords = {
          lat: longitude,
          lng: latitude,
        };
      } else {
        console.warn('No location found');
        this.pickupCoords = null;
      }
    } catch (err) {
      console.error('Geocoding failed', err);
    }
  }

  async onDropTextChange(value: string): Promise<void> {
    this.dropLocationText = value;

    if (!value.trim()) return;

    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&SingleLine=${encodeURIComponent(
      value
    )}&outFields=Match_addr,Addr_type&maxLocations=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        const location = data.candidates[0].location;
        const longitude = location.x;
        const latitude = location.y;

        console.log('Drop Coordinates:', longitude, latitude);
        this.dropCoords = {
          lat: latitude,
          lng: longitude,
        };
      } else {
        console.warn('No location found for drop');
        this.dropCoords = null;
      }
    } catch (err) {
      console.error('Geocoding failed for drop', err);
    }
  }

  onMapLocationSelected(event: {
    coords: { lat: number; lng: number };
    address: string;
  }) {
    if (this.mapApplyOnPickUpYaDrop === 'pickup') {
      this.pickupCoords = event.coords ? event.coords : this.pickupCoords;
      this.pickupLocationText = event.address
        ? event.address
        : this.pickupLocationText;
    } else {
      this.dropCoords = event.coords ? event.coords : this.dropCoords;
      this.dropLocationText = event.address
        ? event.address
        : this.dropLocationText;
    }
    this.inputMethod = 'text';
  }
  constructor(
    private locationService: LocationService,
    private router: Router,
    private geocodingService: GeocodingService
  ) {}

  submitLocations() {
    if (!this.pickupCoords || !this.dropCoords) {
      alert('Please select both pickup and drop locations.');
      return;
    }

    const bookingData = {
      PickUpLocationLatitude: this.pickupCoords.lat,
      PickUpLocationLongitude: this.pickupCoords.lng,
      DropLocationLatitude: this.dropCoords.lat,
      DropLocationLongitude: this.dropCoords.lng,
    };
    console.log(
      bookingData.PickUpLocationLatitude,
      bookingData.PickUpLocationLongitude,
      bookingData.DropLocationLatitude,
      bookingData.DropLocationLongitude
    );

    this.locationService.storeLocation(bookingData).subscribe({
      next: (response) => {
        console.log('Success:', response);
        alert('Locations submitted');
        this.router.navigate(['/Login']);
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
