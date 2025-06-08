import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupDropComponent } from './pickup-drop.component';

describe('PickupDropComponent', () => {
  let component: PickupDropComponent;
  let fixture: ComponentFixture<PickupDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickupDropComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickupDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
