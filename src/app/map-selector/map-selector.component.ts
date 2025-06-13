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
import Point from '@arcgis/core/geometry/Point';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

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
    coords: { lat: number; lng: number };
    address: string;
  }>();
  map: Map;
  view: MapView;
  marker: Graphic;
  selectedCoords: { lat: number; lng: number };
  address: string;

  userMapPoint: { lat: number; lng: number };

  initMap() {
    if (this.location === '') {
      try {
        navigator.geolocation.getCurrentPosition((position) => {
          this.userMapPoint = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        });
      } catch (error) {
        console.warn(
          'Location access denied or failed. Using default location (Delhi).'
        );
      }
    } else {
      this.getCoordinateFromAddress(this.location).then(() => {
        const map = new Map({
          basemap: 'streets-navigation-vector',
        });
        this.view = new MapView({
          container: this.mapViewEl.nativeElement,
          map,
          center: [this.userMapPoint.lat, this.userMapPoint.lng],
          zoom: 15,
        });

        const graphicsLayer = new GraphicsLayer();
        this.view.map.add(graphicsLayer);
        console.log(this.userMapPoint.lng, this.userMapPoint.lat);
        this.addMarker(this.userMapPoint.lat, this.userMapPoint.lng);
        this.reverseGeocode(this.userMapPoint.lng, this.userMapPoint.lat).then(
          () => {
            this.address = this.userAddress;
            console.log('Initial Address:', this.address);
            this.selectedCoords = { ...this.userMapPoint };

            this.view.when(() => {
              this.view.on('click', (event) => {
                const point: Point = event.mapPoint;
                if (point.latitude && point.longitude) {
                  this.userMapPoint.lat = point.latitude;
                  this.userMapPoint.lng = point.longitude;

                  this.addMarker(this.userMapPoint.lng, this.userMapPoint.lat);
                  this.reverseGeocode(
                    this.userMapPoint.lat,
                    this.userMapPoint.lng
                  ).then(() => {
                    this.address = this.userAddress;
                    console.log('Clicked Address:', this.address);

                    this.selectedCoords = { ...this.userMapPoint };
                  });
                }
              });
            });
          }
        );
      });
    }
  }
  setLocation() {
    console.log(this.selectedCoords);
    console.log('dfghh', this.address);
    this.locationSelected.emit({
      coords: this.selectedCoords,
      address: this.address,
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }
  userAddress: string = '';
  async reverseGeocode(lat: number, lng: number): Promise<void> {
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${lng},${lat}&f=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log('Raw geocode response:', data);

      if (data.address) {
        this.userAddress = data.address.Match_addr;

        console.log('Resolved Address:', this.userAddress);
      } else {
        console.warn('No address found');
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  }
  addMarker(lng: number, lat: number) {
    if (this.marker && this.view) {
      this.view.graphics.remove(this.marker);
    }
    this.marker = new Graphic({
      geometry: new Point({ longitude: lng, latitude: lat }),
      symbol: {
        type: 'simple-marker',
        color: this.mode === 'pickup' ? 'green' : 'red',
        size: '14px',
      },
    });
    this.view.graphics.add(this.marker);
  }

  async getCoordinateFromAddress(value: string): Promise<void> {
    // this.pickupLocationText = value;
    console.log('vinita', value);

    if (!value.trim()) return;

    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&SingleLine=${encodeURIComponent(
      value
    )}&outFields=Match_addr,Addr_type&maxLocations=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('data => ', data);
      console.log(data.candidates);
      console.log(data.candidates.length);
      console.log(data.candidates[0].location.x);
      console.log(data.candidates[0].location.y);

      if (data.candidates && data.candidates.length > 0) {
        const location = data.candidates[0].location;
        const longitude: number = location.x;
        const latitude: number = location.y;
        console.log('sdgfd', longitude, latitude);

        console.log('Pickup Coordinates:', longitude, latitude);
        this.userMapPoint = {
          lat: longitude,
          lng: latitude,
        };

        // this.pickupCoords = {
        //   lat: longitude,
        //   lng: latitude,
        // };
      } else {
        console.warn('No location found');
        // this.pickupCoords = null;
      }
    } catch (err) {
      console.error('Geocoding failed', err);
    }
  }
}
