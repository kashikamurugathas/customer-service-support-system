import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceLevelAgreementManagement } from './service-level-agreement-management';

describe('ServiceLevelAgreementManagement', () => {
  let component: ServiceLevelAgreementManagement;
  let fixture: ComponentFixture<ServiceLevelAgreementManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceLevelAgreementManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceLevelAgreementManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
