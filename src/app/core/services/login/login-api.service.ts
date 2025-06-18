import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginApiService {
  private readonly loginUrl = 'https://localhost:7125/api/Auth/Login';

  constructor(private http: HttpClient) {}

  login(userData: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.loginUrl, userData);
  }
}
