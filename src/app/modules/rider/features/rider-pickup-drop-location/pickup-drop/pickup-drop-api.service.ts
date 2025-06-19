import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PickupDropApiService {
  private readonly RiderPickUpAndDropUrl =
    'https://localhost:7125/api/Rider/StoreRiderLocation';

  constructor(private http: HttpClient) {}

  storeLocation(RiderPickUpAndDropCoordinates: any): Observable<any> {
    console.log(RiderPickUpAndDropCoordinates);

    return this.http.post(
      this.RiderPickUpAndDropUrl,
      RiderPickUpAndDropCoordinates,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
        },
      }
    );
  }
}
