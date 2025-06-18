import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrDriverService {
  private hubConnection: signalR.HubConnection;
  public driverLocationSubject = new BehaviorSubject<any>(null);
  driverLocation$ = this.driverLocationSubject.asObservable();

  public initConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7125/driverHub')
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

  constructor() {}
  public registerListeners() {
    this.hubConnection.on('ReceiveDriverLocation', (location) => {
      console.log('Received location:', location);
      this.driverLocationSubject.next(location);
    });
  }
}
