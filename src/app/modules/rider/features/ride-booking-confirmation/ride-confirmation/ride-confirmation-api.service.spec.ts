import { TestBed } from '@angular/core/testing';

import { RideConfirmationApiService } from './ride-confirmation-api.service';

describe('RideConfirmationApiService', () => {
  let service: RideConfirmationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideConfirmationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
