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
  constructor(
    private authService: LoginApiService,
    private router: Router,
    private signalrServices: SignalrDriverService
  ) {}

  onSubmit(form: NgForm): void {
    console.log(form.value);
    this.authService.login(form.value).subscribe({
      next: (response) => {
        console.log('Success:', response);
        localStorage.setItem('Token', response.token);
        console.log(localStorage.getItem('Role'));
        const decode: DecodedToken = jwtDecode(response.token);
        const role =
          decode[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ];
        console.log(role);
        console.log(localStorage.getItem('Role'));
        localStorage.setItem('Role', role);

        if (role === 'Rider') {
          this.signalrServices.initConnection();
          this.signalrServices.startConnection();
          this.router.navigate(['/PickUpAndDropLocation']);
        } else {
          this.router.navigate(['/DriverLocation']);
        }
      },
      error: (error) => {
        console.log('Error:', error);
      },
      complete: () => {
        console.log('Request complete');
      },
    });
  }
}
