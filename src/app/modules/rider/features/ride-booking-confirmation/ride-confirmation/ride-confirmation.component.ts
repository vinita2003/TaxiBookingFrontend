import { Component, OnInit } from '@angular/core';
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
  pickupAndDropCoordinate: PickupDropModel;
  distanceInKm: number;

  constructor(
    private distanceService: DistanceService,
    private geocodeService: GeocodeService,
    private rideConfirmationApiService: RideConfirmationApiService
  ) {
    console.log(localStorage.getItem('pickupAndDropCoordinates'));
    const data = sessionStorage.getItem('pickupAndDropCoordinates');

    if (data) {
      this.pickupAndDropCoordinate = JSON.parse(data);
    }
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
            };

            this.rideConfirmationApiService
              .sendRideDetails(rideDetails)
              .subscribe({
                next: (response) => {
                  console.log('Success:', response);
                  alert('Ride Detail send Successfully');
                },
                error: (error) => {
                  console.log('Error:', error);
                },
                complete: () => {
                  console.log('Request complete');
                },
              });

            console.log('Ride Details:', rideDetails);
          });
      });
  }
}
