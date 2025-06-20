import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { StyleOnErrorDirective } from 'src/app/shared/directive/custom-directive-style-on-error/style-on-error.directive'; // correct path lagana
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { LoginApiService } from './login-api.service';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from './login-model';
import { SignalrDriverService } from '../signalr-driver/signalr-driver.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, StyleOnErrorDirective, RouterModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user = {
    PhoneNumber: '',
    Password: '',
  };

  Role: string;
  constructor(
    private authService: LoginApiService,
    private router: Router,
    private signalrServices: SignalrDriverService
  ) {}

  onSubmit(form: NgForm): void {
    console.log('Form Data:', form.value);

    this.authService.login(form.value).subscribe({
      next: (response) => {
        console.log('Login Success:', response);

        sessionStorage.setItem('Token', response.token);
        console.log('Token stored:', sessionStorage.getItem('Token'));

        const decode: DecodedToken = jwtDecode(response.token);
        const role =
          decode[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ];
        this.Role = role;
        console.log('Role from token:', role);

        sessionStorage.setItem('Role', role);
        console.log(' Role stored:', sessionStorage.getItem('Role'));

        this.signalrServices.initConnection();
        this.signalrServices.startConnection();

        if (role === 'Rider') {
          this.router.navigate(['/PickUpAndDropLocation']);
        } else {
          this.router.navigate(['/DriverLocation']);
        }
      },

      error: (error) => {
        console.log('Login Error:', error);
      },

      complete: () => {
        console.log('Login Request complete');
      },
    });
  }
}
