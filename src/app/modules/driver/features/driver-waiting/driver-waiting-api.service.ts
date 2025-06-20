import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DriverWaitingApiService {
  private readonly DriverAcceptUrl =
    'https://localhost:7125/api/Driver/StoreDriverAvailability';

  constructor(private http: HttpClient) {}

  sendRiderId(RiderId: any): Observable<any> {
    console.log(RiderId);

    return this.http.post(this.DriverAcceptUrl, RiderId, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
      },
    });
  }
}
