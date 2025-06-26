import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrDriverService {
  private hubConnection: signalR.HubConnection;
  private driverLocationSubject = new Subject<any>();
  private driverAvailabilitySubject = new Subject<any>();
  private rideRequestSubject = new Subject<any>();
  private riderInfoSubject = new Subject<any>();
  private driverInfoSubject = new Subject<any>();
  private rideDetailId = new Subject<any>();
  private driverLiveLocationSubject = new Subject<any>();
  driverLocation$ = this.driverLocationSubject.asObservable();
  driverAvailability$ = this.driverAvailabilitySubject.asObservable();
  rideRequest$ = this.rideRequestSubject.asObservable();
  riderInfoSubject$ = this.riderInfoSubject.asObservable();
  driverInfoSubject$ = this.driverInfoSubject.asObservable();
  rideDetailId$ = this.rideDetailId.asObservable();
  driverLiveLocation$ = this.driverLiveLocationSubject.asObservable();

  public initConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7125/driverHub', {
        accessTokenFactory: () => sessionStorage.getItem('Token') || '',
      })
      .withAutomaticReconnect()
      .build();

    this.registerListeners();

    console.log('coonection init');
  }

  public startConnection(): void {
    this.hubConnection
      .start()
      .then(() => console.log('SignalR started'))
      .catch((err) => console.error('SignalR start error:', err));
  }

  public stopConnection(): void {
    this.hubConnection
      .stop()
      .then(() => console.log('SignalR stopped'))
      .catch((err) => console.error('SignalR stop error:', err));
  }

  public sendDriverLocation(location: any): void {
    this.hubConnection
      .invoke('SendDriverLocation', location)
      .catch(console.error);
  }

  constructor() {}
  public registerListeners() {
    this.hubConnection.on('ReceiveDriverLocation', (location) => {
      console.log('Received location:', location);
      this.driverLocationSubject.next(location);
    });

    this.hubConnection.on('ReceiveDriverAvailability', (driverId) => {
      console.log('Received Availability:', driverId);
      this.driverAvailabilitySubject.next(driverId);
    });

    this.hubConnection.on('ReceiveRideRequest', (rideDetails) => {
      console.log('Received Ride Request:', rideDetails);
      this.rideRequestSubject.next(rideDetails);
    });

    this.hubConnection.on('ReceiveRiderDetails', (riderInfo) => {
      console.log('Received Rider Information', riderInfo);
      this.riderInfoSubject.next(riderInfo);
    });
    this.hubConnection.on('ReceiveDriverDetails', (driverInfo) => {
      console.log('Received Driver Information', driverInfo);
      this.driverInfoSubject.next(driverInfo);
    });
    this.hubConnection.on('NotifyDrivers', (rideDetailId) => {
      console.log('RideDetails Id', rideDetailId);
      this.rideDetailId.next(rideDetailId);
    });
    this.hubConnection.on(
      'ReceiveDriverLiveLocationInformation',
      (rideDetailId) => {
        console.log('ReceiveDriverLiveLocationInformation', rideDetailId);
        this.driverLiveLocationSubject.next(rideDetailId);
      }
    );
  }
}
