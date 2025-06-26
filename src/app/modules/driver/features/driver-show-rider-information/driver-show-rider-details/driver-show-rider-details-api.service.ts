import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DriverShowRiderDetailsApiService {
  private readonly DriverLiveLocationInformationUrl =
    'https://localhost:7125/api/Driver/updateLiveLocation';

  constructor(private http: HttpClient) {}

  sendDriverLiveLocationInofrmationId(RiderId: any): Observable<any> {
    console.log(RiderId);

    return this.http.post(
      this.DriverLiveLocationInformationUrl,
      { RiderId },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
        },
      }
    );
  }
}
