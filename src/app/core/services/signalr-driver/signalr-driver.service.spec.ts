import { TestBed } from '@angular/core/testing';

import { SignalrDriverService } from './signalr-driver.service';

describe('SignalrDriverService', () => {
  let service: SignalrDriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalrDriverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
