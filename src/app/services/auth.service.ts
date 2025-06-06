import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userRegisterUrl =
    'https://localhost:7125/api/Auth/RiderRegister';

  private readonly driverRegisterUrl =
    'https://localhost:7125/api/Auth/DriverRegister';

  private readonly loginUrl = 'https://localhost:7125/api/Auth/Login';

  constructor(private http: HttpClient) {}

  registerUser(userData: any): Observable<any> {
    return this.http.post(this.userRegisterUrl, userData);
  }
  registerDriver(userData: any): Observable<any> {
    return this.http.post(this.driverRegisterUrl, userData);
  }
  login(userData: any): Observable<any> {
    return this.http.post(this.loginUrl, userData);
  }
}
