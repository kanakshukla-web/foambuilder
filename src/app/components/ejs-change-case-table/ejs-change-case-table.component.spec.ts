import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjsChangeCaseTableComponent } from './ejs-change-case-table.component';

describe('EjsChangeCaseTableComponent', () => {
  let component: EjsChangeCaseTableComponent;
  let fixture: ComponentFixture<EjsChangeCaseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjsChangeCaseTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EjsChangeCaseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
