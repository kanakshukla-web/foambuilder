import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjsChangeCaseComponent } from './ejs-change-case.component';

describe('EjsChangeCaseComponent', () => {
  let component: EjsChangeCaseComponent;
  let fixture: ComponentFixture<EjsChangeCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjsChangeCaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EjsChangeCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
