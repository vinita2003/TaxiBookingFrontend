import { Component, OnInit } from '@angular/core';
import { SignalrDriverService } from 'src/app/core/services/signalr-driver/signalr-driver.service';
import { DriverWaitingApiService } from './driver-waiting-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-waiting',
  templateUrl: './driver-waiting.component.html',
  styleUrls: ['./driver-waiting.component.css'],
})
export class DriverWaitingComponent implements OnInit {
  rideDetails: {
    PickupAddress: string;
    DropAddress: string;
    EstimatedFare: number;
    RiderRequestId: string;
  }[] = [];

  // rideDetailId: any;

  constructor(
    private signalrService: SignalrDriverService,
    private driverAceptedApiService: DriverWaitingApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signalrService.rideRequest$.subscribe((rideDetails) => {
      console.log('Ride Details', rideDetails);
      this.rideDetails.push({
        PickupAddress: rideDetails.pickupAddress,
        DropAddress: rideDetails.dropAddress,
        EstimatedFare: rideDetails.estimatedFare,
        RiderRequestId: rideDetails.rideDetailId,
      });
    });
    this.signalrService.rideDetailId$.subscribe((rideDetailId) => {
      console.log('Ride Detail Id', rideDetailId);
      this.rideDetails = this.rideDetails.filter(
        (rideDetail) => rideDetail.RiderRequestId != rideDetailId
      );
    });
  }

  acceptRide(ride: any) {
    console.log(' Ride accepted!', ride);
    const rideDetailsSend: {
      riderDetailId: number;
    } = {
      riderDetailId: ride?.RiderRequestId,
    };
    this.router.navigate(['/DriverShowRiderDetails'], {
      state: {
        rideDetailsSend: rideDetailsSend,
      },
    });
    this.driverAceptedApiService
      .sendRiderId(rideDetailsSend)
      .subscribe((response) => {
        console.log('driverinfo', response);
      });
  }

  rejectRide(ride: any) {
    console.log(' Ride rejected!', ride);
  }
}
