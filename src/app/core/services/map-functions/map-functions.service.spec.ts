import { TestBed } from '@angular/core/testing';

import { MapFunctionsService } from './map-functions.service';

describe('MapFunctionsService', () => {
  let service: MapFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
