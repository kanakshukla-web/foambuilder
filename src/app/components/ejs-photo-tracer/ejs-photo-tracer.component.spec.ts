import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjsPhotoTracerComponent } from './ejs-photo-tracer.component';

describe('EjsPhotoTracerComponent', () => {
  let component: EjsPhotoTracerComponent;
  let fixture: ComponentFixture<EjsPhotoTracerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjsPhotoTracerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EjsPhotoTracerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
