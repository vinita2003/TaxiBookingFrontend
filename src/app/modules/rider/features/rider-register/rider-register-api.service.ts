import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RiderRegisterApiService {
  private readonly url = 'https://localhost:7125/api/Auth/RiderRegister';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.url, userData);
  }
}
