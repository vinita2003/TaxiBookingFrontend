import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  constructor(private http: HttpClient) {}

  getSuggestions(query: string): Observable<string[]> {
    if (!query || query.trim().length < 3) return of([]);

    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=${encodeURIComponent(
      query
    )}&f=json&maxSuggestions=5`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        return response?.suggestions?.map((s: any) => s.text) || [];
      }),
      catchError((err) => {
        console.error('Suggestion fetch failed', err);
        return of([]);
      })
    );
  }

  geocodeAddress(
    address: string
  ): Observable<{ lat: number; lng: number } | null> {
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${encodeURIComponent(
      address
    )}&f=json`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        const location = response?.candidates?.[0]?.location;
        if (location) {
          return { lat: location.y, lng: location.x };
        }
        return null;
      }),
      catchError((err) => {
        console.error('Geocoding failed', err);
        return of(null);
      })
    );
  }
}
