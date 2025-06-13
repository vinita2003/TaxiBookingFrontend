import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverRegisterComponent } from './component/driver-register/driver-register.component';
import { UserRegisterComponent } from './component/user-register/user-register.component';
import { LoginComponent } from './component/login/login.component';
import { PickupDropComponent } from './component/pickup-drop/pickup-drop.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  {
    path: 'DriverRegister',
    component: DriverRegisterComponent,
  },
  { path: 'UserRegister', component: UserRegisterComponent },
  { path: 'Login', component: LoginComponent },
  {
    path: 'PickUpAndDropLocation',
    component: PickupDropComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
