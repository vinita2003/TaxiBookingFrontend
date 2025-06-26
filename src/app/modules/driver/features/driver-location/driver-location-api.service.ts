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

  private readonly DriverAvailabilityBaseUrl =
    'https://localhost:7125/api/Driver/GetAvailability';
  constructor(private http: HttpClient) {}

  getAvailability(): Observable<any> {
    return this.http.get(this.DriverAvailabilityBaseUrl, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
      },
    });
  }

  storeLocation(DriverRegisterLocationCoordinates: any): Observable<any> {
    console.log(DriverRegisterLocationCoordinates);

    return this.http.post(
      this.DriverRegisterLocationUrl,
      DriverRegisterLocationCoordinates,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
        },
      }
    );
  }

  storeAvailability(DriverStatus: any): Observable<any> {
    console.log(DriverStatus);

    return this.http.post(this.DriverRegisterAvailabilityUrl, DriverStatus, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
        'Content-Type': 'application/json',
      },
    });
  }
}
