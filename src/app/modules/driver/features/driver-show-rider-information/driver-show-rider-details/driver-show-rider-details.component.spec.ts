import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverShowRiderDetailsComponent } from './driver-show-rider-details.component';

describe('DriverShowRiderDetailsComponent', () => {
  let component: DriverShowRiderDetailsComponent;
  let fixture: ComponentFixture<DriverShowRiderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverShowRiderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverShowRiderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
