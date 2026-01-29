import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewerForDriverComponent } from './map-viewer-for-driver.component';

describe('MapViewerForDriverComponent', () => {
  let component: MapViewerForDriverComponent;
  let fixture: ComponentFixture<MapViewerForDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapViewerForDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapViewerForDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
