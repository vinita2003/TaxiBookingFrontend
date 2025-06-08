import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';

@Component({
  selector: 'app-pickup-drop',
  templateUrl: './pickup-drop.component.html',
  styleUrls: ['./pickup-drop.component.css'],
})
export class PickupDropComponent implements AfterViewInit {
  @ViewChild('mapViewNode', { static: false }) private mapViewEl!: ElementRef;
  map!: Map;
  view!: MapView;

  pickupInputMethod: 'text' | 'map' = 'text';
  dropInputMethod: 'text' | 'map' = 'text';

  pickupLocationText: string = '';
  dropLocationText: string = '';

  pickupCoords: { lat: number; lng: number } | null = null;
  dropCoords: { lat: number; lng: number } | null = null;

  pickupMarker!: Graphic;
  dropMarker!: Graphic;

  addressSuggestions: string[] = [
    'Connaught Place, Delhi',
    'India Gate, Delhi',
    'Rajiv Chowk, Delhi',
    'Gurgaon Sector 14',
    'Cyber City, Gurgaon',
  ];

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    this.map = new Map({
      basemap: 'streets-navigation-vector',
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        this.view = new MapView({
          container: this.mapViewEl.nativeElement,
          map: this.map,
          center: [longitude, latitude],
          zoom: 15,
        });

        this.view.when(() => {
          this.setPickupLocation(longitude, latitude);
          this.getAddressFromCoordinates(latitude, longitude);
          this.view.on('click', (event) => {
            const point = event.mapPoint;

            if (point.longitude != null && point.latitude != null) {
              if (
                this.pickupInputMethod === 'map' &&
                this.dropInputMethod !== 'map'
              ) {
                this.setPickupLocation(point.longitude, point.latitude);
                this.getAddressFromCoordinates(point.latitude, point.longitude);
              } else if (
                this.dropInputMethod === 'map' &&
                this.pickupInputMethod !== 'map'
              ) {
                this.setDropLocation(point.longitude, point.latitude);
              } else if (
                this.pickupInputMethod === 'map' &&
                this.dropInputMethod === 'map'
              ) {
                if (!this.pickupCoords) {
                  this.setPickupLocation(point.longitude, point.latitude);
                  this.getAddressFromCoordinates(
                    point.latitude,
                    point.longitude
                  );
                } else {
                  this.setDropLocation(point.longitude, point.latitude);
                }
              }
            }
          });
        });
      },
      (error) => {
        // Fallback in case location not allowed
        this.view = new MapView({
          container: this.mapViewEl.nativeElement,
          map: this.map,
          center: [77.209, 28.6139],
          zoom: 12,
        });
      }
    );
  }

  setPickupLocation(lng: number, lat: number) {
    this.pickupCoords = { lat, lng };

    // Remove existing marker if any
    if (this.pickupMarker) {
      this.view.graphics.remove(this.pickupMarker);
    }

    // Create new marker
    this.pickupMarker = new Graphic({
      geometry: new Point({ longitude: lng, latitude: lat }),
      symbol: {
        type: 'simple-marker',
        color: 'green',
        size: '14px',
      },
    });

    this.view.graphics.add(this.pickupMarker);
  }

  setDropLocation(lng: number, lat: number) {
    this.dropCoords = { lat, lng };
    if (this.dropMarker) {
      this.dropMarker.geometry = new Point({ longitude: lng, latitude: lat });
    } else {
      this.dropMarker = new Graphic({
        geometry: new Point({ longitude: lng, latitude: lat }),
        symbol: {
          type: 'simple-marker',
          color: 'red',
          size: '14px',
        },
      });
      this.view.graphics.add(this.dropMarker);
    }
  }
  getAddressFromCoordinates(lat: number, lng: number) {
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${lng},${lat}&f=json`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.address) {
          const address = data.address.Match_addr;
          console.log('Address:', address);
          this.pickupLocationText = address; // ya jaha bhi use karna ho
        } else {
          console.warn('No address found');
        }
      })
      .catch((error) => {
        console.error('Reverse geocoding failed:', error);
      });
  }

  async onPickupTextChange(value: string) {
    this.pickupLocationText = value;

    if (!value.trim()) return;

    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&SingleLine=${encodeURIComponent(
      value
    )}&outFields=Match_addr,Addr_type&maxLocations=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        const location = data.candidates[0].location;
        const longitude = location.x;
        const latitude = location.y;

        this.setPickupLocation(longitude, latitude); // aapka function
        console.log('Pickup Coordinates:', longitude, latitude);
      } else {
        console.warn('No location found');
        this.pickupCoords = null;
        if (this.pickupMarker && this.view)
          this.view.graphics.remove(this.pickupMarker);
      }
    } catch (err) {
      console.error('Geocoding failed', err);
    }
  }

  async onDropTextChange(value: string) {
    this.dropLocationText = value;

    if (!value.trim()) return;

    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&SingleLine=${encodeURIComponent(
      value
    )}&outFields=Match_addr,Addr_type&maxLocations=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        const location = data.candidates[0].location;
        const longitude = location.x;
        const latitude = location.y;

        this.setDropLocation(longitude, latitude);
        console.log('Drop Coordinates:', longitude, latitude);
      } else {
        console.warn('No location found for drop');
        this.dropCoords = null;
        if (this.dropMarker && this.view)
          this.view.graphics.remove(this.dropMarker);
      }
    } catch (err) {
      console.error('Geocoding failed for drop', err);
    }
  }

  submitLocations() {
    if (!this.pickupCoords || !this.dropCoords) {
      alert('Please select both pickup and drop locations.');
      return;
    }

    const bookingData = {
      pickup: {
        address: this.pickupLocationText,
        coordinates: this.pickupCoords,
      },
      drop: {
        address: this.dropLocationText,
        coordinates: this.dropCoords,
      },
    };

    console.log('Booking Data:', bookingData);

    alert('Locations submitted! Check console for data.');

    // TODO: yaha backend API call kar sakte hain bookingData bhejne ke liye
  }
}
