import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn(): boolean {
    const token: string | null = localStorage.getItem('Token');
    return Boolean(token);
  }
  getRole(): 'Driver' | 'Rider' | null {
    return localStorage.getItem('Role') as 'Driver' | 'Rider' | null;
  }
}
