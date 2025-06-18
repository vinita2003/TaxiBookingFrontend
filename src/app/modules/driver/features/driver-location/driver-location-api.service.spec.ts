import { TestBed } from '@angular/core/testing';

import { DriverLocationApiService } from './driver-location-api.service';

describe('DriverLocationApiService', () => {
  let service: DriverLocationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverLocationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
