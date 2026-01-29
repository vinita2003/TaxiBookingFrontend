import { TestBed } from '@angular/core/testing';

import { RideConfirmationService } from './ride-confirmation.service';

describe('RideConfirmationService', () => {
  let service: RideConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
