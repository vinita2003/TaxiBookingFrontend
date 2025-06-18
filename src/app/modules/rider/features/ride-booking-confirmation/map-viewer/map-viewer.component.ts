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
import { DistanceService } from 'src/app/core/services/distance/distance.service';
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
    private signalrService: SignalrDriverService,
    private distanceService: DistanceService
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

      this.signalrService.driverLocation$.subscribe((driverLocation) => {
        console.log(driverLocation);
        console.log(
          this.distanceService.calculateDistance(
            this.pickupAndDropCoordinate.PickUpLocationLongitude,
            this.pickupAndDropCoordinate.PickUpLocationLatitude,
            driverLocation.driverLocationLatitude,
            driverLocation.driverLocationLongitude
          )
        );

        if (!driverLocation) return;

        console.log('vinita shah driver location');
        console.log(this.driverMarkers);
        const existing = this.driverMarkers.find(
          (d) => d.driverId === driverLocation.driverId
        );
        if (
          existing &&
          !(
            this.distanceService.calculateDistance(
              this.pickupAndDropCoordinate.PickUpLocationLongitude,
              this.pickupAndDropCoordinate.PickUpLocationLatitude,
              driverLocation.driverLocationLatitude,
              driverLocation.driverLocationLongitude
            ) <= 1
          )
        ) {
          this.mapFunction.removeMarker(this.view, existing.marker);
        } else if (
          existing &&
          this.distanceService.calculateDistance(
            this.pickupAndDropCoordinate.PickUpLocationLongitude,
            this.pickupAndDropCoordinate.PickUpLocationLatitude,
            driverLocation.driverLocationLatitude,
            driverLocation.driverLocationLongitude
          ) <= 1
        ) {
          existing.marker.geometry = {
            type: 'point',
            longitude: driverLocation.driverLocationLongitude,
            latitude: driverLocation.driverLocationLatitude,
          };
        } else {
          const marker = this.mapFunction.addMarker(
            this.view,
            driverLocation.driverLocationLongitude,
            driverLocation.driverLocationLatitude,
            'blue'
          );
          this.driverMarkers.push({
            driverId: driverLocation.driverId,
            marker,
          });
        }
      });
    });
  }

  // isWithin1km(
  //   pickupLongitude: number,
  //   pickupLatitude: number,
  //   driverLocation: {
  //     driverLocationLatitude: number;
  //     driverLocationLongitude: number;
  //   }
  // ): boolean {
  //   const toRad = (value: number): number => (value * Math.PI) / 180;

  //   console.log(pickupLatitude);
  //   console.log(pickupLongitude);
  //   console.log(driverLocation.driverLocationLongitude);
  //   console.log(driverLocation.driverLocationLatitude);

  //   const R = 6371;

  //   const dLat = toRad(driverLocation.driverLocationLatitude - pickupLatitude);
  //   const dLon = toRad(
  //     driverLocation.driverLocationLongitude - pickupLongitude
  //   );

  //   const lat1 = toRad(pickupLatitude);
  //   const lat2 = toRad(driverLocation.driverLocationLatitude);

  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   const distance = R * c;

  //   return distance <= 5;
  //}
}
