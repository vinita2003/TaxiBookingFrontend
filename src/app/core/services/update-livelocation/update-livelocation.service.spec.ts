import { TestBed } from '@angular/core/testing';

import { UpdateLivelocationService } from './update-livelocation.service';

describe('UpdateLivelocationService', () => {
  let service: UpdateLivelocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateLivelocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
