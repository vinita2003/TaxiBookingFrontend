import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RideConfirmationApiService {
  private readonly RiderConfirmationUrl =
    'https://localhost:7125/api/Rider/RideRequestSendToAvailableDriver';

  constructor(private http: HttpClient) {}

  sendRideDetails(RiderDetails: any): Observable<any> {
    console.log(RiderDetails);

    return this.http.post(this.RiderConfirmationUrl, RiderDetails, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
      },
    });
  }
}
