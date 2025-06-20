import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { StyleOnErrorDirective } from 'src/app/shared/directive/custom-directive-style-on-error/style-on-error.directive';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DriverRegisterApiService } from './driver-register-api.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-driver-register',
  templateUrl: './driver-register.component.html',
  styleUrls: ['./driver-register.component.css'],
  imports: [StyleOnErrorDirective, FormsModule, NgIf, RouterModule],
})
export class DriverRegisterComponent {
  driver = {
    Name: '',
    PhoneNumber: '',
    Password: '',
    Gender: '',
    CarNumber: '',
    CarType: '',
    AadharCardNumber: '',
    LicenseCardNumber: '',
    Role: 'Driver',
  };

  constructor(
    private authService: DriverRegisterApiService,
    private router: Router
  ) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log(this.driver);
      this.authService.register(this.driver).subscribe({
        next: (response) => {
          console.log('Success:', response);
        },
        error: (error) => {
          console.log('Error:', error);
        },
        complete: () => {
          console.log('Request complete');
        },
      });
      alert('Registered Successfully!');
      this.router.navigate(['/Login']);
    } else {
      console.log('Invalid Form');
    }
  }
}
