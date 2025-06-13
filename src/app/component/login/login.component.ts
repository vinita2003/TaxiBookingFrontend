import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { StyleOnErrorDirective } from 'src/app/directive/style-on-error.directive'; // correct path lagana
import { Router, RouterModule } from '@angular/router';
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
    PhoneNumber: '',
    Password: '',
  };
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm): void {
    console.log(form.value);
    this.authService.login(form.value).subscribe({
      next: (response) => {
        console.log('Success:', response);
        localStorage.setItem('Token', response.token);
        this.router.navigate(['/PickUpAndDropLocation']);
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
