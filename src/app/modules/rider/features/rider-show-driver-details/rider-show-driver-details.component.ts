import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { SignalrDriverService } from 'src/app/core/services/signalr-driver/signalr-driver.service';
import { UpdateLivelocationService } from 'src/app/core/services/update-livelocation/update-livelocation.service';

@Component({
  selector: 'app-rider-show-driver-details',
  templateUrl: './rider-show-driver-details.component.html',
  styleUrls: ['./rider-show-driver-details.component.css'],
})
export class RiderShowDriverDetailsComponent implements OnInit {
  @Input() LocationInformation: {
    driverLocationLatitude: number;
    driverLocationLongitude: number;
    pickupLocationLatitude: number;
    pickupLocationLongitude: number;
    dropLocationLatitude: number;
    dropLocationLongitude: number;
  };
  reachToPickupLocation: boolean = false;
  driverInformation: {
    name: string;
    phoneNumber: string;
    gender: string;
    carNumber: string;
  };

  driverGender: string = 'Male';
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (
  //     changes['LocationInformation'] &&
  //     !changes['LocationInformation'].firstChange
  //   ) {
  //     const updated = changes['LocationInformation'].currentValue;

  //     this.LocationInformation = {
  //       ...updated,
  //     };

  //     console.log('Updated LocationInformation:', this.LocationInformation);
  //   }
  // }
  constructor(
    private signalrService: SignalrDriverService,
    private updateLiveLocation: UpdateLivelocationService
  ) {}

  ngOnInit(): void {
    // this.updateLiveLocation.driverLocation$.subscribe((location) => {
    //   if (location) {
    //     this.LocationInformation = {
    //       ...this.LocationInformation,
    //       driverLocationLatitude: location.driverLocationLatitude,
    //       driverLocationLongitude: location.driverLocationLongitude,
    //     };

    //     console.log(
    //       'Updated Driver Location in Rider Side:',
    //       this.LocationInformation
    //     );
    //   }
    // });
    this.signalrService.driverLiveLocation$.subscribe((rideDetailId) => {
      console.log(rideDetailId);
      this.driverMovement();
    });

    this.signalrService.driverInfoSubject$.subscribe((driverInformation) => {
      console.log('Ride Details', driverInformation);
      if (driverInformation.gender === 1) {
        this.driverGender = 'Female';
      } else if (driverInformation.gender === 3) {
        this.driverGender = 'Others';
      }
      this.driverInformation = {
        name: driverInformation.name,
        phoneNumber: driverInformation.phoneNumber,
        gender: driverInformation.gender,
        carNumber: driverInformation.carNumber,
      };

      this.LocationInformation = {
        driverLocationLatitude: driverInformation.driverLocationLatitude,
        driverLocationLongitude: driverInformation.driverLocationLongitude,
        pickupLocationLatitude: driverInformation.pickupLocationLatitude,
        pickupLocationLongitude: driverInformation.pickupLocationLongitude,
        dropLocationLatitude: driverInformation.dropLocationLatitude,
        dropLocationLongitude: driverInformation.dropLocationLongitude,
      };
    });
    console.log(this.LocationInformation);
  }

  driverMovement() {
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

      // this.signalrService.sendDriverLocation({
      //   driverLocationLatitude: lat,
      //   driverLocationLongitude: lng,
      //   rideDetailId: this.riderDetailId,
      // });

      if (step >= 1) {
        clearInterval(interval);
        this.reachToPickupLocation = true;
      }
    }, 1000);
  }
}
