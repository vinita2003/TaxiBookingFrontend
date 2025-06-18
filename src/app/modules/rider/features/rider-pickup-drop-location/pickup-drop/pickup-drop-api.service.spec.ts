import { TestBed } from '@angular/core/testing';

import { PickupDropApiService } from './pickup-drop-api.service';

describe('PickupDropApiService', () => {
  let service: PickupDropApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PickupDropApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
