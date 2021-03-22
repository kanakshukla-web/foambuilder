import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccounthandlerComponent } from './accounthandler.component';

describe('AccounthandlerComponent', () => {
  let component: AccounthandlerComponent;
  let fixture: ComponentFixture<AccounthandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccounthandlerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccounthandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
