import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsMonthComponent } from './reports-month.component';

describe('ReportsMonthComponent', () => {
  let component: ReportsMonthComponent;
  let fixture: ComponentFixture<ReportsMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsMonthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
