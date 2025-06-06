import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { StyleOnErrorDirective } from 'src/app/directive/style-on-error.directive'; // correct path lagana
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, StyleOnErrorDirective, RouterModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user = {
    Name: '',
    PhoneNumber: '',
    Password: '',
  };
  constructor(private authService: AuthService) {}

  onSubmit(form: NgForm): void {
    console.log(form.value);
    this.authService.login(form.value).subscribe({
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
  }
}
