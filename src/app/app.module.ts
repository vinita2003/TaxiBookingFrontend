import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { AutoCompleteModule } from '@progress/kendo-angular-dropdowns';
import { PickupDropComponent } from './modules/rider/features/rider-pickup-drop-location/pickup-drop/pickup-drop.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapSelectorComponent } from './modules/rider/features/rider-pickup-drop-location/map-selector/map-selector.component';
import { RideConfirmationComponent } from './modules/rider/features/ride-booking-confirmation/ride-confirmation/ride-confirmation.component';
import { MapViewerComponent } from './modules/rider/features/ride-booking-confirmation/map-viewer/map-viewer.component';
import { DriverLocationComponent } from './modules/driver/features/driver-location/driver-location.component';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DriverWaitingComponent } from './modules/driver/features/driver-waiting/driver-waiting.component';
import { RideAcceptedComponent } from './modules/rider/features/ride-accepted/ride-accepted.component';
import { DriverShowRiderDetailsComponent } from './modules/driver/features/driver-show-rider-information/driver-show-rider-details/driver-show-rider-details.component';
import { RiderShowDriverDetailsComponent } from './modules/rider/features/rider-show-driver-details/rider-show-driver-details.component';
import { MapViewerForDriverComponent } from './modules/driver/features/driver-show-rider-information/map-viewer-for-driver/map-viewer-for-driver.component';

@NgModule({
  declarations: [
    AppComponent,
    PickupDropComponent,
    MapSelectorComponent,
    RideConfirmationComponent,
    MapViewerComponent,
    DriverLocationComponent,
    DriverWaitingComponent,
    RideAcceptedComponent,
    DriverShowRiderDetailsComponent,
    RiderShowDriverDetailsComponent,
    MapViewerForDriverComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DropDownsModule,
    InputsModule,
    ButtonsModule,
    AutoCompleteModule,
    BrowserAnimationsModule,
    PopupModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
