import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { ReportsAnalyticsManagement } from './reports-analytics-management';

describe('ReportsAnalyticsManagement', () => {
  let component: ReportsAnalyticsManagement;
  let fixture: ComponentFixture<ReportsAnalyticsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsAnalyticsManagement],
      providers: [{
        provide: GraphQLService,
        useValue: { query: () => of({ allReports: { items: [], pagination: { totalItems: 0 } } }) },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsAnalyticsManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
