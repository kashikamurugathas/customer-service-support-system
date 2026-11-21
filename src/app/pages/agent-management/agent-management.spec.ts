import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { AgentManagement } from './agent-management';

describe('AgentManagement', () => {
  let component: AgentManagement;
  let fixture: ComponentFixture<AgentManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentManagement],
      providers: [{
        provide: GraphQLService,
        useValue: { query: () => of({ allAgents: { items: [], pagination: { totalItems: 0 } } }) },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
