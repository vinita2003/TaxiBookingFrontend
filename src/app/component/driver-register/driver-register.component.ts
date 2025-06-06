import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { StyleOnErrorDirective } from 'src/app/directive/style-on-error.directive';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
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
    UserName: '',
    PhoneNumber: '',
    Password: '',
    Gender: '',
    CarNumber: '',
    CarType: '',
    AadharCardNumber: '',
    LicenseCardNumber: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm): void {
    // console.log(form.value);
    // console.log(name.errors);
    this.authService.registerDriver(form.value).subscribe({
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
  }
}
