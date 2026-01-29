import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderShowDriverDetailsComponent } from './rider-show-driver-details.component';

describe('RiderShowDriverDetailsComponent', () => {
  let component: RiderShowDriverDetailsComponent;
  let fixture: ComponentFixture<RiderShowDriverDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderShowDriverDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderShowDriverDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
