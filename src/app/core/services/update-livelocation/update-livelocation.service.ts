import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateLivelocationService {
  private driverLocationSource = new Subject<
    | {
        driverLocationLatitude: number;
        driverLocationLongitude: number;
      }
    | {
        pickupLocationLatitude: number;
        pickupLocationLongitude: number;
      }
    | null
  >();

  driverLocation$ = this.driverLocationSource.asObservable();

  updateLocation(
    location:
      | {
          driverLocationLatitude: number;
          driverLocationLongitude: number;
        }
      | {
          pickupLocationLatitude: number;
          pickupLocationLongitude: number;
        }
  ) {
    this.driverLocationSource.next(location);
  }
  constructor() {}
}
