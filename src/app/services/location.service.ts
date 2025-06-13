import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly userPickUpAndDropUrl =
    'https://localhost:7125/api/Location/StoreLocation';

  constructor(private http: HttpClient) {}

  storeLocation(userPickUpAndDropCoordinates: any): Observable<any> {
    console.log(userPickUpAndDropCoordinates);

    return this.http.post(
      this.userPickUpAndDropUrl,
      userPickUpAndDropCoordinates,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Token')}`,
        },
      }
    );
  }
}
