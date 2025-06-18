import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderRegisterComponent } from './rider-register.component';

describe('RegisterComponent', () => {
  let component: RiderRegisterComponent;
  let fixture: ComponentFixture<RiderRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RiderRegisterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RiderRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
