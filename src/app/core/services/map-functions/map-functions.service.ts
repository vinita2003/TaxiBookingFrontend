import { Injectable } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';

@Injectable({
  providedIn: 'root',
})
export class MapFunctionsService {
  createMap(): Map {
    return new Map({
      basemap: 'streets-navigation-vector',
      layers: [new GraphicsLayer()],
    });
  }
  createMapView(
    map: Map,
    container: HTMLDivElement,
    center: number[],
    zoom: number = 12
  ): MapView {
    return new MapView({ container, map, center, zoom });
  }

  addMarker(view: MapView, lng: number, lat: number, color: string): Graphic {
    console.log('shahhhhh');
    console.log(lng);
    console.log(lat);
    const marker = new Graphic({
      geometry: new Point({ longitude: lng, latitude: lat }),
      symbol: {
        type: 'simple-marker',
        color,
        size: '14px',
      },
    });
    console.log('end');
    view.graphics.add(marker);
    console.log(marker);
    return marker;
  }

  removeMarker(view: MapView, marker: Graphic | undefined): void {
    if (marker) {
      view.graphics.remove(marker);
    }
  }

  constructor() {}
}
