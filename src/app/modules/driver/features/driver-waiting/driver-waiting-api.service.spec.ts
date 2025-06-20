import { TestBed } from '@angular/core/testing';

import { DriverWaitingApiService } from './driver-waiting-api.service';

describe('DriverWaitingApiService', () => {
  let service: DriverWaitingApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverWaitingApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
