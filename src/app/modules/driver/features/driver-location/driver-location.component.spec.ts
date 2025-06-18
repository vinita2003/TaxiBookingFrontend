import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverLocationComponent } from './driver-location.component';

describe('DriverLocationComponent', () => {
  let component: DriverLocationComponent;
  let fixture: ComponentFixture<DriverLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
