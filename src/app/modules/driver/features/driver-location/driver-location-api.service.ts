import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DriverLocationApiService {
  private readonly DriverRegisterLocationUrl =
    'https://localhost:7125/api/Driver/StoreDriverLocationAndSendToRider';

  private readonly DriverRegisterAvailabilityUrl =
    'https://localhost:7125/api/Driver/StoreDriverAvailability';

  constructor(private http: HttpClient) {}

  storeLocation(DriverRegisterLocationCoordinates: any): Observable<any> {
    console.log(DriverRegisterLocationCoordinates);

    return this.http.post(
      this.DriverRegisterLocationUrl,
      DriverRegisterLocationCoordinates,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Token')}`,
        },
      }
    );
  }

  storeAvailability(DriverStatus: any): Observable<any> {
    console.log(DriverStatus);

    return this.http.post(this.DriverRegisterAvailabilityUrl, DriverStatus, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('Token')}`,
      },
    });
  }
}
