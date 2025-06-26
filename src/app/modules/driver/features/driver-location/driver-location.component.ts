import { Component, OnInit } from '@angular/core';
import { GeocodeService } from 'src/app/core/services/geocode/geocode.service';
import { DriverLocationApiService } from './driver-location-api.service';
import { SignalrDriverService } from 'src/app/core/services/signalr-driver/signalr-driver.service';
import { Router } from '@angular/router';
import { UpdateLivelocationService } from 'src/app/core/services/update-livelocation/update-livelocation.service';

@Component({
  selector: 'app-driver-location',
  templateUrl: './driver-location.component.html',
  styleUrls: ['./driver-location.component.css'],
})
export class DriverLocationComponent implements OnInit {
  latitude: number = 0;
  longitude: number = 0;
  locationText: string = '';
  addressSuggestions: string[] = [];
  isOnline: boolean = false;
  showPopup: boolean = true;
  Availability: 'Online' | 'Offline' = 'Offline';
  inputMethod: 'manual' | 'map' = 'manual';
  // hubConnection: any;
  riderDetails: any;

  constructor(
    private geocodeService: GeocodeService,
    private driverRegisterLocationApi: DriverLocationApiService,
    private signalrService: SignalrDriverService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentLocation();
    this.driverRegisterLocationApi.getAvailability().subscribe({
      next: (data) => {
        console.log('Driver availability:', data);
        this.Availability = data.availability.result;
        if (this.Availability == 'Online') {
          this.isOnline = true;
        }
        console.log(data.result);
      },
      error: (err) => {
        console.error('Error fetching availability:', err);
      },
    });
  }

  onToggleOnline(value: boolean) {
    this.isOnline = value;
    if (value) {
      this.showPopup = false;
      this.Availability = 'Online';
    } else {
      this.showPopup = true;
      this.Availability = 'Offline';
      this.signalrService.stopConnection();
    }

    const data = {
      Availability: this.Availability,
    };
    this.driverRegisterLocationApi.storeAvailability(data).subscribe({
      next: (response) => {
        console.log('Success:', response);
        alert(' Driver Availabilty submitted');
      },
      error: (error) => {
        console.log('Error:', error);
      },
      complete: () => {
        console.log('Request complete');
      },
    });
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.geocodeService
          .reverseGeocode(this.longitude, this.latitude)
          .then((data) => {
            console.log(data);
            this.locationText = data;
          });
      },
      (error) => {
        console.log('geolocation error:', error);
        alert('Location access denied or unavailable.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  onFocus(): void {
    this.addressSuggestions = [];
    this.inputMethod = 'manual';
  }

  onButtonClick(): void {
    this.inputMethod = 'map';
  }

  onMapLocationSelected(event: {
    coords: { longitude: number; latitude: number };
    address: string;
  }) {
    this.latitude = event.coords.latitude;
    this.longitude = event.coords.longitude;
    this.locationText = event.address;
    this.inputMethod = 'manual';
  }

  onLocationTextChange(query: string) {
    this.locationText = query;
    this.geocodeService.getSuggestions(query).then((data) => {
      console.log(data);
      this.addressSuggestions = data;
    });
    this.geocodeService.geocodeAddress(query).then((data) => {
      (this.latitude = data.latitude), (this.longitude = data.longitude);
    });
  }

  // selectSuggestion(text: string) {
  //   this.locationText = text;
  //   this.addressSuggestions = [];
  //   console.log(this.latitude);
  //   console.log(this.longitude);
  //   this.geocodeService.geocodeAddress(text).then((data) => {
  //     (this.latitude = data.latitude), (this.longitude = data.longitude);
  //   });
  // }

  submitLocation() {
    console.log(this.latitude, this.longitude, this.locationText);
    const storeDriverLocationAndStatus: {
      DriverLocationLongitude: number;
      DriverLocationLatitude: number;
    } = {
      DriverLocationLongitude: this.longitude,
      DriverLocationLatitude: this.latitude,
    };

    this.driverRegisterLocationApi
      .storeLocation(storeDriverLocationAndStatus)
      .subscribe({
        next: (response) => {
          console.log('Success:', response);
          alert(' Driver Locations submitted');
          this.router.navigate(['/DriverWaiting'], {
            state: { rideBookingDetails: this.riderDetails },
          });
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
