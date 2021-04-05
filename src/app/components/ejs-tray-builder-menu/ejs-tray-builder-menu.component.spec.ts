import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjsTrayBuilderMenuComponent } from './ejs-tray-builder-menu.component';

describe('EjsTrayBuilderMenuComponent', () => {
  let component: EjsTrayBuilderMenuComponent;
  let fixture: ComponentFixture<EjsTrayBuilderMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjsTrayBuilderMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EjsTrayBuilderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
