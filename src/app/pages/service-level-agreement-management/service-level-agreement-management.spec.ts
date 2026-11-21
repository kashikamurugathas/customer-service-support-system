import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { ServiceLevelAgreementManagement } from './service-level-agreement-management';

describe('ServiceLevelAgreementManagement', () => {
  let component: ServiceLevelAgreementManagement;
  let fixture: ComponentFixture<ServiceLevelAgreementManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceLevelAgreementManagement],
      providers: [{
        provide: GraphQLService,
        useValue: {
          query: (document: string) => of(document.includes('GetSlaTracking')
            ? { allSlaTracking: { items: [], pagination: { totalPages: 1 } } }
            : { allSlaRules: { items: [], pagination: { totalPages: 1 } } }),
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceLevelAgreementManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
