import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

// Make sure you have your custom directive imported here
import { StyleOnErrorDirective } from 'src/app/directive/style-on-error.directive'; // update path accordingly

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
  standalone: true,
  imports: [FormsModule, RouterModule, StyleOnErrorDirective, NgIf],
})
export class UserRegisterComponent {
  user = {
    Name: '',
    PhoneNumber: '',
    Password: '',
    Gender: '',
    Role: 'Rider',
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('User Registered:', form.value);

      this.authService.registerUser(form.value).subscribe({
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
