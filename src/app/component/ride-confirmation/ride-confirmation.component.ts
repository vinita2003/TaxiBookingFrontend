import { Component, OnInit } from '@angular/core';
import { RideService } from 'src/app/services/ride-service.service';

@Component({
  selector: 'app-ride-confirmation',
  templateUrl: './ride-confirmation.component.html',
  styleUrls: ['./ride-confirmation.component.css'],
})
export class RideConfirmationComponent implements OnInit {
  pickupLocation: string = '';
  dropLocation: string = '';
  nearbyDrivers: any[] = [];
  prices: { mini: number; sedan: number; suv: number } = {
    mini: 0,
    sedan: 0,
    suv: 0,
  };

  constructor(private rideService: RideService) {}

  ngOnInit() {
    this.getRideData();
  }

  getRideData() {
    // Replace this with real API call or service logic
    this.rideService.getRideDetails().subscribe((data) => {
      this.pickupLocation = data.pickup;
      this.dropLocation = data.drop;

      this.rideService
        .getNearbyDrivers(data.pickupCoords)
        .subscribe((drivers) => {
          this.nearbyDrivers = drivers;
        });

      this.rideService
        .getPriceEstimates(data.pickupCoords, data.dropCoords)
        .subscribe((prices) => {
          this.prices = prices;
        });
    });
  }

  confirmBooking() {
    alert('Ride Confirmed!');
    // Optionally send confirmation to backend here
  }
}
