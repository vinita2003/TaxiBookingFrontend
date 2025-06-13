import { Injectable } from '@angular/core';
import { of } from 'rxjs'; // Use HttpClient in real case

@Injectable({
  providedIn: 'root',
})
export class RideService {
  constructor() {}

  getRideDetails() {
    // Simulating data from backend
    return of({
      pickup: 'Connaught Place, Delhi',
      drop: 'Saket, Delhi',
      pickupCoords: { lat: 28.6315, lng: 77.2167 },
      dropCoords: { lat: 28.5222, lng: 77.2075 },
    });
  }

  getNearbyDrivers(pickupCoords: any) {
    // Simulated drivers within 1 km
    return of([
      { name: 'Driver 1', carType: 'Mini' },
      { name: 'Driver 2', carType: 'Sedan' },
      { name: 'Driver 3', carType: 'SUV' },
    ]);
  }

  getPriceEstimates(pickup: any, drop: any) {
    // Normally you'd calculate this from distance/time
    return of({
      mini: 120,
      sedan: 160,
      suv: 200,
    });
  }
}
