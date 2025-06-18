import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DistanceService {
  constructor() {}
  calculateDistance(
    pickUpLocationLongitude: number,
    pickUpLocationLatitude: number,
    dropLocationLatitude: number,
    dropLocationLongitude: number
  ): number {
    const R = 6371;

    const dLatitude = this.deg2rad(
      dropLocationLatitude - pickUpLocationLatitude
    );
    const dLongitude = this.deg2rad(
      dropLocationLongitude - pickUpLocationLongitude
    );

    const a =
      Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) +
      Math.cos(this.deg2rad(pickUpLocationLatitude)) *
        Math.cos(this.deg2rad(dropLocationLatitude)) *
        Math.sin(dLongitude / 2) *
        Math.sin(dLongitude / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10;
  }

  private deg2rad(degree: number): number {
    return degree * (Math.PI / 180);
  }
}
