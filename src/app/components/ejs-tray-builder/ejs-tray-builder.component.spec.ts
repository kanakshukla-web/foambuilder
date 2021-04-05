import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjsTrayBuilderComponent } from './ejs-tray-builder.component';

describe('EjsTrayBuilderComponent', () => {
  let component: EjsTrayBuilderComponent;
  let fixture: ComponentFixture<EjsTrayBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjsTrayBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EjsTrayBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
