import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeAccountComponent } from './resume-account.component';

describe('ResumeAccountComponent', () => {
  let component: ResumeAccountComponent;
  let fixture: ComponentFixture<ResumeAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
