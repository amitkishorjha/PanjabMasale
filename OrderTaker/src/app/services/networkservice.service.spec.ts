import { TestBed } from '@angular/core/testing';

import { NetworkserviceService } from './networkservice.service';

describe('NetworkserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NetworkserviceService = TestBed.get(NetworkserviceService);
    expect(service).toBeTruthy();
  });
});
