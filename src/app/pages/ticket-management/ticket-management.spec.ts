import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { TicketManagement } from './ticket-management';

describe('TicketManagement', () => {
  let component: TicketManagement;
  let fixture: ComponentFixture<TicketManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketManagement],
      providers: [{
        provide: GraphQLService,
        useValue: { query: () => of({ allTickets: { items: [], pagination: { totalItems: 0 } } }) },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
