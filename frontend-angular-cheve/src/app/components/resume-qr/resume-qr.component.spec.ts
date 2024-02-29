import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeQrComponent } from './resume-qr.component';

describe('ResumeQrComponent', () => {
  let component: ResumeQrComponent;
  let fixture: ComponentFixture<ResumeQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeQrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
