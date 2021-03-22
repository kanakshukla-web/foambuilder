import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangelComponent } from './rectangel.component';

describe('RectangelComponent', () => {
  let component: RectangelComponent;
  let fixture: ComponentFixture<RectangelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RectangelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
