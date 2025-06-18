import { Component, OnInit } from '@angular/core';
import { ColumnMenuAutoSizeColumnComponent } from '@progress/kendo-angular-grid';
import { GeocodeService } from 'src/app/core/services/geocode/geocode.service';
import { DriverLocationApiService } from './driver-location-api.service';
import { SignalrDriverService } from 'src/app/core/services/signalr-driver/signalr-driver.service';

@Component({
  selector: 'app-driver-location',
  templateUrl: './driver-location.component.html',
  styleUrls: ['./driver-location.component.css'],
})
export class DriverLocationComponent implements OnInit {
  latitude: number = 0;
  longitude: number = 0;
  address: string = '';
  suggestions: string[] = [];
  isOnline: boolean = false;
  showPopup: boolean = true;
  Availabilty: 'Online' | 'Offline' = 'Offline';

  constructor(
    private geocodeService: GeocodeService,
    private driverRegisterLocationApi: DriverLocationApiService,
    private signalrService: SignalrDriverService
  ) {}

  ngOnInit(): void {
    this.getCurrentLocation();
    this.signalrService.initConnection();
  }

  onToggleOnline(value: boolean) {
    this.isOnline = value;
    if (value) {
      this.showPopup = false;
      this.Availabilty = 'Online';
      this.signalrService.startConnection();
    } else {
      this.showPopup = true;
      this.Availabilty = 'Offline';
      this.signalrService.stopConnection();
    }

    const storeDriverStatus: {
      Availabilty: 'Online' | 'Offline';
    } = {
      Availabilty: this.Availabilty,
    };

    this.driverRegisterLocationApi
      .storeAvailability(storeDriverStatus)
      .subscribe({
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
            this.address = data;
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

  onAddressChange(query: string) {
    this.address = query;
    this.geocodeService.getSuggestions(query).then((data) => {
      console.log(data);
      this.suggestions = data;
    });
    this.geocodeService.geocodeAddress(query).then((data) => {
      (this.latitude = data.latitude), (this.longitude = data.longitude);
    });
  }

  selectSuggestion(text: string) {
    this.address = text;
    this.suggestions = [];
    console.log(this.latitude);
    console.log(this.longitude);
    this.geocodeService.geocodeAddress(text).then((data) => {
      (this.latitude = data.latitude), (this.longitude = data.longitude);
    });
  }

  submitLocation() {
    console.log(this.latitude, this.longitude, this.address);
    const storeDriverLocationAndStatus: {
      Availabilty: 'Online' | 'Offline';
      DriverLocationLongitude: number;
      DriverLocationLatitude: number;
    } = {
      Availabilty: this.Availabilty,
      DriverLocationLongitude: this.longitude,
      DriverLocationLatitude: this.latitude,
    };

    this.driverRegisterLocationApi
      .storeLocation(storeDriverLocationAndStatus)
      .subscribe({
        next: (response) => {
          console.log('Success:', response);
          alert(' Driver Locations submitted');
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
