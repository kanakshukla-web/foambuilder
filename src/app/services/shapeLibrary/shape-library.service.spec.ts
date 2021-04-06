import { TestBed } from '@angular/core/testing';

import { ShapeLibraryService } from './shape-library.service';

describe('ShapeLibraryService', () => {
  let service: ShapeLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShapeLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
