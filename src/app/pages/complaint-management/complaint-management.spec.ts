import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { ComplaintManagement } from './complaint-management';

describe('ComplaintManagement', () => {
  let component: ComplaintManagement;
  let fixture: ComponentFixture<ComplaintManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintManagement],
      providers: [{
        provide: GraphQLService,
        useValue: { query: () => of({ allComplaints: { items: [], pagination: { totalItems: 0 } } }) },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(ComplaintManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
