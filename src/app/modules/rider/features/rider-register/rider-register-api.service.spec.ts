import { TestBed } from '@angular/core/testing';

import { RiderRegisterApiService } from './rider-register-api.service';

describe('UserRegisterApiService', () => {
  let service: RiderRegisterApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiderRegisterApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
