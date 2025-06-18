import { TestBed } from '@angular/core/testing';

import { DriverRegisterApiService } from './driver-register-api.service';

describe('DriverRegisterApiService', () => {
  let service: DriverRegisterApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverRegisterApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
