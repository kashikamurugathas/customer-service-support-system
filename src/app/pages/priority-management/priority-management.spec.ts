import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { PriorityManagement } from './priority-management';

describe('PriorityManagement', () => {
  let component: PriorityManagement;
  let fixture: ComponentFixture<PriorityManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorityManagement],
      providers: [{
        provide: GraphQLService,
        useValue: { query: () => of({ allPriorities: { items: [], pagination: { totalItems: 0 } } }) },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(PriorityManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
