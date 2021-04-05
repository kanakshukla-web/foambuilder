import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjsChnageCaseMenuComponent } from './ejs-chnage-case-menu.component';

describe('EjsChnageCaseMenuComponent', () => {
  let component: EjsChnageCaseMenuComponent;
  let fixture: ComponentFixture<EjsChnageCaseMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjsChnageCaseMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EjsChnageCaseMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
