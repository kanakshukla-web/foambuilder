import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalButtonMenuComponent } from './global-button-menu.component';

describe('GlobalButtonMenuComponent', () => {
  let component: GlobalButtonMenuComponent;
  let fixture: ComponentFixture<GlobalButtonMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalButtonMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalButtonMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
