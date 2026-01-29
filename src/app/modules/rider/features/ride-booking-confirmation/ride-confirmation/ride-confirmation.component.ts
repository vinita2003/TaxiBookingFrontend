import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { PickupDropModel } from '../../rider-pickup-drop-location/pickup-drop/pickup-drop-model';
import { Router } from '@angular/router';
import { DistanceService } from 'src/app/core/services/distance/distance.service';
import { GeocodeService } from 'src/app/core/services/geocode/geocode.service';
import { RideConfirmationApiService } from './ride-confirmation-api.service';

@Component({
  selector: 'app-ride-confirmation',
  templateUrl: './ride-confirmation.component.html',
  styleUrls: ['./ride-confirmation.component.css'],
})
export class RideConfirmationComponent implements OnInit {
  rideDetailId: number;
  pickupAndDropCoordinate: PickupDropModel;
  distanceInKm: number;
  nearByDrivers: {
    driverId: number;
    driverLocationLatitude: number;
    driverLocationLongitude: number;
  }[] = [];

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['rideBookingDetailId']) {
  //     console.log('Updated rideBookingDetailId:', this.rideDetailId);
  //   }
  // }

  constructor(
    private distanceService: DistanceService,
    private geocodeService: GeocodeService,
    private rideConfirmationApiService: RideConfirmationApiService,
    private router: Router
  ) {
    // console.log(localStorage.getItem('pickupAndDropCoordinates'));
    // const data = sessionStorage.getItem('pickupAndDropCoordinates');
    // if (data) {
    //   this.pickupAndDropCoordinate = JSON.parse(data);
    // }
  }
  carTypes = [
    { name: 'Mini', ratePerKm: 10 },
    { name: 'Sedan', ratePerKm: 15 },
    { name: 'UV', ratePerKm: 20 },
  ];

  calculateFare(ratePerKm: number): number {
    return ratePerKm * this.distanceInKm;
  }

  selectedCar: any = null;

  selectCar(car: any) {
    this.selectedCar = car;
    console.log('You selected:', car.name);
  }

  ngOnInit(): void {
    const state = history.state;

    this.pickupAndDropCoordinate = state?.bookingData ?? null;
    this.rideDetailId =
      state?.riderBookingDetailsIdAndDriversLocation?.rideDetailId ?? 0;
    this.nearByDrivers =
      state?.riderBookingDetailsIdAndDriversLocation?.nearByDrivers ?? null;

    console.log(this.pickupAndDropCoordinate);
    console.log(this.nearByDrivers);
    this.distanceInKm = this.distanceService.calculateDistance(
      this.pickupAndDropCoordinate.PickUpLocationLongitude,
      this.pickupAndDropCoordinate.PickUpLocationLatitude,
      this.pickupAndDropCoordinate.DropLocationLatitude,
      this.pickupAndDropCoordinate.DropLocationLongitude
    );
    console.log('Distance:', this.distanceInKm, 'km');
  }

  confirmRide() {
    if (!this.selectedCar || !this.pickupAndDropCoordinate) {
      console.warn('Missing data');
      return;
    }
    let pickupAddress: string;
    let dropAddress: string;

    this.geocodeService
      .reverseGeocode(
        this.pickupAndDropCoordinate.PickUpLocationLongitude,
        this.pickupAndDropCoordinate.PickUpLocationLatitude
      )
      .then((pickupData) => {
        pickupAddress = pickupData;

        this.geocodeService
          .reverseGeocode(
            this.pickupAndDropCoordinate.DropLocationLongitude,
            this.pickupAndDropCoordinate.DropLocationLatitude
          )
          .then((dropData) => {
            dropAddress = dropData;

            const rideDetails = {
              PickupAddress: pickupAddress,
              DropAddress: dropAddress,
              EstimatedFare: this.calculateFare(this.selectedCar.ratePerKm),
              CarType: this.selectedCar.name,
              PickupLatitude:
                this.pickupAndDropCoordinate.PickUpLocationLatitude,
              PickupLongitude:
                this.pickupAndDropCoordinate.PickUpLocationLongitude,
              RideDetailId: this.rideDetailId,
            };

            this.rideConfirmationApiService
              .sendRideDetails(rideDetails)
              .subscribe({
                next: (response) => {
                  console.log('Success:', response);
                  alert('Ride Detail send Successfully');
                  console.log('Ride Details:', rideDetails);
                  this.router.navigate(['/RiderShowDriverDetails']);
                },
                error: (error) => {
                  console.log('Error:', error);
                },

                complete: () => {
                  console.log('Request complete');
                },
              });
          });
      });
  }
}
