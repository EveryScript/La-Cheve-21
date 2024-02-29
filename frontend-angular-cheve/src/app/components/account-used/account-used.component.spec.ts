import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountUsedComponent } from './account-used.component';

describe('AccountUsedComponent', () => {
  let component: AccountUsedComponent;
  let fixture: ComponentFixture<AccountUsedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountUsedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountUsedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
