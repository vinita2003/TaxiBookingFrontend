import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverRegisterComponent } from './modules/driver/features/driver-register/driver-register.component';
import { RiderRegisterComponent } from './modules/rider/features/rider-register/rider-register.component';
import { LoginComponent } from './core/services/login/login.component';
import { PickupDropComponent } from './modules/rider/features/rider-pickup-drop-location/pickup-drop/pickup-drop.component';
import { AuthGuard } from './core/guard/auth.guard';
import { RideConfirmationComponent } from './modules/rider/features/ride-booking-confirmation/ride-confirmation/ride-confirmation.component';
import { DriverLocationComponent } from './modules/driver/features/driver-location/driver-location.component';
import { DriverWaitingComponent } from './modules/driver/features/driver-waiting/driver-waiting.component';

const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  {
    path: 'DriverRegister',
    component: DriverRegisterComponent,
  },
  { path: 'UserRegister', component: RiderRegisterComponent },
  { path: 'Login', component: LoginComponent },
  {
    path: 'PickUpAndDropLocation',
    component: PickupDropComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'Rider' },
  },
  {
    path: 'RideConfirmation',
    component: RideConfirmationComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'Rider' },
  },
  {
    path: 'DriverLocation',
    component: DriverLocationComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'Driver' },
  },

  {
    path: 'DriverWaiting',
    component: DriverWaitingComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'Driver' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
