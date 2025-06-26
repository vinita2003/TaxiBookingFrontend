import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DistanceService } from 'src/app/core/services/distance/distance.service';
import { MapFunctionsService } from 'src/app/core/services/map-functions/map-functions.service';
import { SignalrDriverService } from 'src/app/core/services/signalr-driver/signalr-driver.service';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Polyline from '@arcgis/core/geometry/Polyline';
import { UpdateLivelocationService } from 'src/app/core/services/update-livelocation/update-livelocation.service';

@Component({
  selector: 'app-map-viewer-for-driver',
  templateUrl: './map-viewer-for-driver.component.html',
  styleUrls: ['./map-viewer-for-driver.component.css'],
})
export class MapViewerForDriverComponent {
  @Input() LocationInformation: {
    driverLocationLatitude: number;
    driverLocationLongitude: number;
    pickupLocationLatitude: number;
    pickupLocationLongitude: number;
    dropLocationLatitude: number;
    dropLocationLongitude: number;
  };
  @Input() reachToPickupLocation: Boolean;
  @ViewChild('mapContainer') mapViewEl!: ElementRef;
  map: Map;
  view: MapView;
  marker: Graphic;

  constructor(
    private mapFunction: MapFunctionsService,
    private signalrService: SignalrDriverService,
    private distanceService: DistanceService,
    private updateLiveLocation: UpdateLivelocationService
  ) {}
  // ngOnInit(): void {
  //   this.updateLiveLocation.driverLocation$.subscribe((location) => {
  //     if (location) {
  //       this.LocationInformation = {
  //         ...this.LocationInformation,
  //         driverLocationLatitude: location.driverLocationLatitude,
  //         driverLocationLongitude: location.driverLocationLongitude,
  //       };

  //       console.log(
  //         'Updated Driver Location in Rider Side:',
  //         this.LocationInformation
  //       );
  //       this.updateDriverMarker(
  //         this.LocationInformation.driverLocationLongitude,
  //         this.LocationInformation.driverLocationLatitude
  //       );
  //     }
  //   });
  // }

  ngAfterViewInit(): void {
    console.log(this.LocationInformation);
    this.loadMap();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['LocationInformation'] &&
      !changes['LocationInformation'].firstChange
    ) {
      const updated = changes['LocationInformation'].currentValue;
      if (!this.reachToPickupLocation) {
        this.updateDriverMarker(
          updated.driverLocationLongitude,
          updated.driverLocationLatitude
        );
      } else {
        this.updateDriverMarker(
          updated.pickupLocationLongitude,
          updated.pickupLocationLatitude
        );
      }
    }
  }

  loadMap(): void {
    this.map = this.mapFunction.createMap();
    this.view = this.mapFunction.createMapView(
      this.map,
      this.mapViewEl.nativeElement,
      [
        this.LocationInformation.driverLocationLongitude,
        this.LocationInformation.driverLocationLatitude,
      ]
    );

    // const polyline = new Polyline({
    //   paths: [
    //     [
    //       [
    //         this.LocationInformation.driverLocationLongitude,
    //         this.LocationInformation.driverLocationLatitude,
    //       ],
    //       [
    //         this.LocationInformation.pickupLocationLongitude,
    //         this.LocationInformation.pickupLocationLatitude,
    //       ],
    //     ],
    //   ],
    //   spatialReference: { wkid: 4326 },
    // });
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

    // const polylineGraphic = new Graphic({
    //   geometry: polyline,
    //   symbol: lineSymbol,
    // });
    this.view.when(() => {
      console.log('vinita');
      if (!this.reachToPickupLocation) {
        this.marker = this.mapFunction.addMarker(
          this.view,
          this.LocationInformation.driverLocationLongitude,
          this.LocationInformation.driverLocationLatitude,
          'blue'
        );

        this.mapFunction.addMarker(
          this.view,
          this.LocationInformation.pickupLocationLongitude,
          this.LocationInformation.pickupLocationLatitude,
          'green'
        );
      } else {
        this.marker = this.mapFunction.addMarker(
          this.view,
          this.LocationInformation.pickupLocationLongitude,
          this.LocationInformation.pickupLocationLatitude,
          'green'
        );

        this.mapFunction.addMarker(
          this.view,
          this.LocationInformation.dropLocationLongitude,
          this.LocationInformation.dropLocationLatitude,
          'red'
        );
      }

      // this.view.graphics.add(polylineGraphic);
    });
  }
  updateDriverMarker(long: number, lat: number): void {
    if (this.marker) {
      this.marker.geometry = {
        type: 'point',
        longitude: long,
        latitude: lat,
      };
    }
  }
}
