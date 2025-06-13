import { TestBed } from '@angular/core/testing';

import { GeocodingServicesService } from './geocoding-services.service';

describe('GeocodingServicesService', () => {
  let service: GeocodingServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeocodingServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
