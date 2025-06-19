import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginApiService } from '../services/login/login-api.service';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const role = this.authService.getRole();
    const excpectedRole = route.data['expectedRole'];

    if (!role && role !== excpectedRole) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
