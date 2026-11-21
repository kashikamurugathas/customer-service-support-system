import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsAnalyticsManagement } from './reports-analytics-management';

describe('ReportsAnalyticsManagement', () => {
  let component: ReportsAnalyticsManagement;
  let fixture: ComponentFixture<ReportsAnalyticsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsAnalyticsManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsAnalyticsManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
