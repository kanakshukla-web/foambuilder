import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RectanglecustomnotchComponent } from './rectanglecustomnotch.component';

describe('RectanglecustomnotchComponent', () => {
  let component: RectanglecustomnotchComponent;
  let fixture: ComponentFixture<RectanglecustomnotchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RectanglecustomnotchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RectanglecustomnotchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
