import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiderRoutingModule } from './rider-routing.module';
import { RideConfirmationComponent } from './features/ride-booking-confirmation/ride-confirmation/ride-confirmation.component';
import { MapViewerComponent } from './features/ride-booking-confirmation/map-viewer/map-viewer.component';


@NgModule({
  declarations: [
    RideConfirmationComponent,
    MapViewerComponent
  ],
  imports: [
    CommonModule,
    RiderRoutingModule
  ]
})
export class RiderModule { }
