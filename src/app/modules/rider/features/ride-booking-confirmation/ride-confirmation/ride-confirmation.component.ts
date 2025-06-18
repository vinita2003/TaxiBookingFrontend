import { Component, OnInit } from '@angular/core';
import { PickupDropModel } from '../../rider-pickup-drop-location/pickup-drop/pickup-drop-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ride-confirmation',
  templateUrl: './ride-confirmation.component.html',
  styleUrls: ['./ride-confirmation.component.css'],
})
export class RideConfirmationComponent implements OnInit {
  pickupAndDropCoordinate: PickupDropModel;

  constructor(private router: Router) {
    console.log('vinita');

    console.log(localStorage.getItem('pickupAndDropCoordinates'));
    const data = localStorage.getItem('pickupAndDropCoordinates');

    if (data) {
      this.pickupAndDropCoordinate = JSON.parse(data);
    }
  }

  ngOnInit(): void {}
}
