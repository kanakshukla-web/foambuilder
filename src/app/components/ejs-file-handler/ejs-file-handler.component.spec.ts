import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjsFileHandlerComponent } from './ejs-file-handler.component';

describe('EjsFileHandlerComponent', () => {
  let component: EjsFileHandlerComponent;
  let fixture: ComponentFixture<EjsFileHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjsFileHandlerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EjsFileHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
