import { TestBed } from '@angular/core/testing';

import { MaterialFormsService } from './material-forms.service';

describe('MaterialFormsService', () => {
  let service: MaterialFormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialFormsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
