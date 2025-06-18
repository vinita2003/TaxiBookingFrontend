import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeocodeService {
  constructor(private http: HttpClient) {}
  async reverseGeocode(lng: number, lat: number): Promise<string> {
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${lng},${lat}&f=json`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      return data.address.Match_addr || '';
    } catch (error) {
      console.error('Reverse geocode error:', error);
      return '';
    }
  }

  async geocodeAddress(
    address: string
  ): Promise<{ longitude: number; latitude: number }> {
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&SingleLine=${encodeURIComponent(
      address
    )}&outFields=Match_addr,Addr_type&maxLocations=1`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      console.log(data.candidates);
      if (data.candidates && data.candidates.length > 0) {
        const location = data.candidates[0].location;
        return { longitude: location.x, latitude: location.y };
      } else {
        console.warn('No geocode candidate found');
        return { longitude: 0, latitude: 0 };
      }
    } catch (error) {
      console.log('Geocode error:', error);
      return { longitude: 0, latitude: 0 };
    }
  }

  async getSuggestions(text: string): Promise<string[]> {
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=${encodeURIComponent(
      text
    )}&f=json&maxSuggestions=5`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      console.log(data.suggestion);
      if (data && data.suggestions) {
        const suggestions: string[] = data.suggestions.map((item: any) => {
          console.log(item);
          return item.text;
        });
        console.log(suggestions);
        return suggestions;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Suggestion fetch error:', error);
      return [];
    }
  }
}
