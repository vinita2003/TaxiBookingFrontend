import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import { GeocodeService } from 'src/app/core/services/geocode/geocode.service';
import { MapFunctionsService } from 'src/app/core/services/map-functions/map-functions.service';

@Component({
  selector: 'app-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.css'],
})
export class MapSelectorComponent {
  @ViewChild('mapContainer') mapViewEl!: ElementRef;
  @Input() mode: 'pickup' | 'drop' = 'pickup';
  @Input() location: string = '';
  @Output() locationSelected = new EventEmitter<{
    coords: { longitude: number; latitude: number };
    address: string;
  }>();
  map: Map;
  view: MapView;
  marker: Graphic;
  selectedCoords: { longitude: number; latitude: number };
  address: string;

  constructor(
    private mapFunction: MapFunctionsService,
    private geocodeService: GeocodeService
  ) {}

  ngAfterViewInit(): void {
    if (this.location) {
      console.log('vinita');
      this.geocodeService
        .geocodeAddress(this.location)
        .then((coordinates) => {
          this.selectedCoords = coordinates;
          this.loadMap();
        })
        .catch((error) => {
          console.error('Geocoding failed:', error);
          alert('Location not found. PLease try again');
        });
    } else {
      console.log('vinita');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.selectedCoords = {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          };
          this.loadMap();
        },
        (error) => {
          console.error('Error getting location:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }

  loadMap(): void {
    const map = this.mapFunction.createMap();
    this.view = this.mapFunction.createMapView(
      map,
      this.mapViewEl.nativeElement,
      [this.selectedCoords.longitude, this.selectedCoords.latitude]
    );
    this.view.when(() => {
      this.marker = this.mapFunction.addMarker(
        this.view,
        this.selectedCoords.longitude,
        this.selectedCoords.latitude,
        this.mode === 'pickup' ? 'green' : 'red'
      );
      this.geocodeService
        .reverseGeocode(
          this.selectedCoords.longitude,
          this.selectedCoords.latitude
        )
        .then((address) => {
          this.address = address;
          this.view.on('click', (event) => {
            console.log(event);
            if (event.mapPoint.longitude && event.mapPoint.latitude) {
              this.selectedCoords = {
                longitude: event.mapPoint.longitude,
                latitude: event.mapPoint.latitude,
              };
            }
            this.mapFunction.removeMarker(this.view, this.marker);
            this.marker = this.mapFunction.addMarker(
              this.view,
              this.selectedCoords.longitude,
              this.selectedCoords.latitude,
              this.mode === 'pickup' ? 'green' : 'red'
            );
            this.geocodeService
              .reverseGeocode(
                this.selectedCoords.longitude,
                this.selectedCoords.latitude
              )
              .then((clickedAddress) => {
                this.address = clickedAddress;
              });
          });
        });
    });
  }

  setLocation(): void {
    this.locationSelected.emit({
      coords: this.selectedCoords,
      address: this.address,
    });
  }
}
