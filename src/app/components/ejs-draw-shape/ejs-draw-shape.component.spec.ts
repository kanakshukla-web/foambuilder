import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjsDrawShapeComponent } from './ejs-draw-shape.component';

describe('EjsDrawShapeComponent', () => {
  let component: EjsDrawShapeComponent;
  let fixture: ComponentFixture<EjsDrawShapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjsDrawShapeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EjsDrawShapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
