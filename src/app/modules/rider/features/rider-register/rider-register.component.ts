import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RiderRegisterApiService } from './rider-register-api.service';
import { Router } from '@angular/router';

import { StyleOnErrorDirective } from 'src/app/shared/directive/custom-directive-style-on-error/style-on-error.directive'; // update path accordingly

@Component({
  selector: 'app-rider-register',
  templateUrl: './rider-register.component.html',
  styleUrls: ['./rider-register.component.css'],
  standalone: true,
  imports: [FormsModule, RouterModule, StyleOnErrorDirective, NgIf],
})
export class RiderRegisterComponent {
  rider = {
    Name: '',
    PhoneNumber: '',
    Password: '',
    Gender: '',
    Role: 'Rider',
  };

  constructor(
    private authService: RiderRegisterApiService,
    private router: Router
  ) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('rider Registered:', form.value);
      console.log(form.value);

      this.authService.register(this.rider).subscribe({
        next: (response) => {
          console.log('Success:', response);
          alert('Registered Successfully!');
          this.router.navigate(['/Login']);
        },
        error: (error) => {
          console.log('Error:', error);
        },
        complete: () => {
          console.log('Request complete');
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
