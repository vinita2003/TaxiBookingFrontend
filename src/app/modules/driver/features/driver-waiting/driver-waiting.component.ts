import { Component, OnInit } from '@angular/core';
import { SignalrDriverService } from 'src/app/core/services/signalr-driver/signalr-driver.service';
import { DriverWaitingApiService } from './driver-waiting-api.service';

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
    Id: number;
  } | null = {
    PickupAddress: 'in time tec',
    DropAddress: 'in time tec',
    EstimatedFare: 89,
    Id: 1,
  };

  constructor(
    private signalrService: SignalrDriverService,
    private driverAceptedApiService: DriverWaitingApiService
  ) {}

  ngOnInit(): void {
    this.signalrService.driverLocation$.subscribe((rideDetails) => {
      rideDetails = {
        PickupAddress: rideDetails.PickupAddress,
        DropAddress: rideDetails.DropAddress,
        EstimatedFare: rideDetails.EstimatedFare,
        Id: rideDetails.Id,
      };
      console.log('Ride Details', rideDetails);
    });
  }

  acceptRide() {
    console.log(' Ride accepted!');
    this.driverAceptedApiService
      .sendRiderId(this.rideDetails?.Id)
      .subscribe((driverinfo) => {
        console.log('driverinfo', driverinfo);
      });
  }

  rejectRide() {
    console.log(' Ride rejected!');
  }
}
