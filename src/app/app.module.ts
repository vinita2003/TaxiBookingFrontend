import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { AutoCompleteModule } from '@progress/kendo-angular-dropdowns';
import { PickupDropComponent } from './component/pickup-drop/pickup-drop.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapSelectorComponent } from './map-selector/map-selector.component';
import { RideConfirmationComponent } from './component/ride-confirmation/ride-confirmation.component';

@NgModule({
  declarations: [AppComponent, PickupDropComponent, MapSelectorComponent, RideConfirmationComponent],
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
