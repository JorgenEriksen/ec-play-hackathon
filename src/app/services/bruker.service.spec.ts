import { TestBed } from '@angular/core/testing';

import { BrukerService } from './bruker.service';

describe('BrukereService', () => {
  let service: BrukerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrukerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
