import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignalrDriverService } from 'src/app/core/services/signalr-driver/signalr-driver.service';
import { UpdateLivelocationService } from 'src/app/core/services/update-livelocation/update-livelocation.service';
import { DriverShowRiderDetailsApiService } from './driver-show-rider-details-api.service';

@Component({
  selector: 'app-driver-show-rider-details',
  templateUrl: './driver-show-rider-details.component.html',
  styleUrls: ['./driver-show-rider-details.component.css'],
})
export class DriverShowRiderDetailsComponent implements OnInit {
  riderPersonalInformation: {
    name: string;
    phoneNumber: string;
    gender: string;
  };
  riderDetailId: number | null;
  reachToPickupLocation: boolean = false;

  LocationInformation: {
    driverLocationLatitude: number;
    driverLocationLongitude: number;
    pickupLocationLatitude: number;
    pickupLocationLongitude: number;
    dropLocationLatitude: number;
    dropLocationLongitude: number;
  };

  riderGender: string = 'Male';
  constructor(
    private signalrService: SignalrDriverService,
    private router: Router,
    private updateLiveLocation: UpdateLivelocationService,
    private driverShowRiderDetailsApi: DriverShowRiderDetailsApiService
  ) {}

  ngOnInit(): void {
    this.signalrService.riderInfoSubject$.subscribe((riderInformation) => {
      console.log('Ride Details', riderInformation);
      if (riderInformation.gender === 1) {
        this.riderGender = 'Female';
      } else if (riderInformation.gender === 3) {
        this.riderGender = 'Others';
      }
      this.riderPersonalInformation = {
        name: riderInformation.name,
        phoneNumber: riderInformation.phoneNumber,
        gender: this.riderGender,
      };

      this.LocationInformation = {
        driverLocationLatitude: riderInformation.driverLocationLatitude,
        driverLocationLongitude: riderInformation.driverLocationLongitude,
        pickupLocationLatitude: riderInformation.pickupLocationLatitude,
        pickupLocationLongitude: riderInformation.pickupLocationLongitude,
        dropLocationLatitude: riderInformation.dropLocationLatitude,
        dropLocationLongitude: riderInformation.dropLocationLongitude,
      };
      this.riderDetailId = riderInformation.riderId;
    });
    console.log(this.riderDetailId);
    console.log(this.riderPersonalInformation);
    console.log(this.LocationInformation);
  }

  driverMovement() {
    this.driverShowRiderDetailsApi
      .sendDriverLiveLocationInofrmationId(this.riderDetailId)
      .subscribe((data) => {
        console.log(data);
      });
    let startLat: number;
    let startLng: number;
    let endLat: number;
    let endLng: number;
    if (!this.reachToPickupLocation) {
      startLat = this.LocationInformation.driverLocationLatitude;
      startLng = this.LocationInformation.driverLocationLongitude;
      endLat = this.LocationInformation.pickupLocationLatitude;
      endLng = this.LocationInformation.pickupLocationLongitude;
    } else {
      startLat = this.LocationInformation.pickupLocationLatitude;
      startLng = this.LocationInformation.pickupLocationLongitude;
      endLat = this.LocationInformation.dropLocationLatitude;
      endLng = this.LocationInformation.dropLocationLongitude;
    }

    let step = 0;
    const interval = setInterval(() => {
      step += 0.05;
      const lat = startLat + (endLat - startLat) * step;
      const lng = startLng + (endLng - startLng) * step;

      if (!this.reachToPickupLocation) {
        this.LocationInformation = {
          ...this.LocationInformation,
          driverLocationLatitude: lat,
          driverLocationLongitude: lng,
        };

        this.updateLiveLocation.updateLocation({
          driverLocationLatitude: lat,
          driverLocationLongitude: lng,
        });
      } else {
        this.LocationInformation = {
          ...this.LocationInformation,
          pickupLocationLatitude: lat,
          pickupLocationLongitude: lng,
        };

        this.updateLiveLocation.updateLocation({
          pickupLocationLatitude: lat,
          pickupLocationLongitude: lng,
        });
      }

      console.log(this.LocationInformation.driverLocationLatitude);
      console.log(this.LocationInformation.driverLocationLongitude);

      if (step >= 1) {
        clearInterval(interval);
        this.reachToPickupLocation = true;
      }
    }, 1000);
  }
  cancelRide(): void {
    alert('Ride cancelled');
  }
}
