import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialFormsComponent } from './material-forms.component';

describe('MaterialFormsComponent', () => {
  let component: MaterialFormsComponent;
  let fixture: ComponentFixture<MaterialFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialFormsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
