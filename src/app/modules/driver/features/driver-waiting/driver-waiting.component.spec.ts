import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverWaitingComponent } from './driver-waiting.component';

describe('DriverWaitingComponent', () => {
  let component: DriverWaitingComponent;
  let fixture: ComponentFixture<DriverWaitingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverWaitingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
