import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DriverWaitingApiService {
  private readonly DriverAcceptUrl =
    'https://localhost:7125/api/Driver/AcceptRide';

  constructor(private http: HttpClient) {}

  sendRiderId(RiderDetailId: any): Observable<any> {
    console.log(RiderDetailId);

    return this.http.post(this.DriverAcceptUrl, RiderDetailId, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
      },
    });
  }
}
