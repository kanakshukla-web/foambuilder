import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjsShapeLibComponent } from './ejs-shape-lib.component';

describe('EjsShapeLibComponent', () => {
  let component: EjsShapeLibComponent;
  let fixture: ComponentFixture<EjsShapeLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjsShapeLibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EjsShapeLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
