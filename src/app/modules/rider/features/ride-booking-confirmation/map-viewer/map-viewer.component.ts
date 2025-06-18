import { Component, OnInit } from '@angular/core';
import {
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
import { PickupDropModel } from '../../rider-pickup-drop-location/pickup-drop/pickup-drop-model';
import { SignalrDriverService } from 'src/app/core/services/signalr-driver/signalr-driver.service';
import Polyline from '@arcgis/core/geometry/Polyline';
interface DriverMarker {
  driverId: string;
  marker: __esri.Graphic;
}
@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.css'],
})
export class MapViewerComponent {
  @ViewChild('mapContainer') mapViewEl!: ElementRef;
  @Input() pickupAndDropCoordinate: PickupDropModel;
  @Input() location: string = '';
  map: Map;
  view: MapView;
  marker: Graphic;

  constructor(
    private mapFunction: MapFunctionsService,
    private geocodeService: GeocodeService,
    private signalrService: SignalrDriverService
  ) {}

  driverMarkers: DriverMarker[] = [];

  ngAfterViewInit(): void {
    console.log(this.pickupAndDropCoordinate);
    this.loadMap();
  }

  loadMap(): void {
    this.map = this.mapFunction.createMap();
    this.view = this.mapFunction.createMapView(
      this.map,
      this.mapViewEl.nativeElement,
      [
        this.pickupAndDropCoordinate.PickUpLocationLongitude,
        this.pickupAndDropCoordinate.PickUpLocationLatitude,
      ]
    );

    const polyline = new Polyline({
      paths: [
        [
          [
            this.pickupAndDropCoordinate.PickUpLocationLongitude,
            this.pickupAndDropCoordinate.PickUpLocationLatitude,
          ],
          [
            this.pickupAndDropCoordinate.DropLocationLongitude,
            this.pickupAndDropCoordinate.DropLocationLatitude,
          ],
        ],
      ],
      spatialReference: { wkid: 4326 },
    });
    const lineSymbol: {
      type: 'simple-line';
      color: number[];
      width: number;
      style: 'dash';
    } = {
      type: 'simple-line',
      color: [226, 119, 40],
      width: 3,
      style: 'dash',
    };

    const polylineGraphic = new Graphic({
      geometry: polyline,
      symbol: lineSymbol,
    });
    this.view.when(() => {
      console.log('vinita');

      this.mapFunction.addMarker(
        this.view,
        this.pickupAndDropCoordinate.PickUpLocationLongitude,
        this.pickupAndDropCoordinate.PickUpLocationLatitude,
        'green'
      );

      this.mapFunction.addMarker(
        this.view,
        this.pickupAndDropCoordinate.DropLocationLongitude,
        this.pickupAndDropCoordinate.DropLocationLatitude,
        'red'
      );
      this.view.graphics.add(polylineGraphic);

      this.signalrService.driverLocation$.subscribe((location) => {
        console.log(location);
        if (
          !location ||
          !this.isWithin1km(
            this.pickupAndDropCoordinate.PickUpLocationLongitude,
            this.pickupAndDropCoordinate.PickUpLocationLatitude,
            location
          )
        )
          return;

        console.log('vinita shah driver location');
        const existing = this.driverMarkers.find(
          (d) => d.driverId === location.driverId
        );

        if (existing) {
          // Update marker geometry
          existing.marker.geometry = {
            type: 'point',
            longitude: location.longitude,
            latitude: location.latitude,
          };
        } else {
          // Add new marker
          const marker = this.mapFunction.addMarker(
            this.view,
            location.longitude,
            location.latitude,
            'blue'
          );
          this.driverMarkers.push({ driverId: location.driverId, marker });
        }
      });
    });
  }
  setLocation(): void {
    console.log('vinita');
  }

  isWithin1km(
    pickupLongitude: number,
    pickupLatitude: number,
    driverLocation: { latitude: number; longitude: number }
  ): boolean {
    const toRad = (value: number): number => (value * Math.PI) / 180;

    const R = 6371; // Radius of Earth in kilometers

    const dLat = toRad(driverLocation.latitude - pickupLatitude);
    const dLon = toRad(driverLocation.longitude - pickupLongitude);

    const lat1 = toRad(pickupLatitude);
    const lat2 = toRad(driverLocation.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance <= 1; // true if within 1 km
  }
}
