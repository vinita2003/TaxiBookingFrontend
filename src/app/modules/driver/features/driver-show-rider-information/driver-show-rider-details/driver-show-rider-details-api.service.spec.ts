import { TestBed } from '@angular/core/testing';

import { DriverShowRiderDetailsApiService } from './driver-show-rider-details-api.service';

describe('DriverShowRiderDetailsApiService', () => {
  let service: DriverShowRiderDetailsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverShowRiderDetailsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
