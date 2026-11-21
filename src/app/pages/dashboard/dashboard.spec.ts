import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [{
        provide: GraphQLService,
        useValue: {
          query: () => of({ allTickets: { items: [], pagination: { totalItems: 0 } } }),
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show live overview content instead of the demo table', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Support overview');
    expect(text).toContain('Total tickets');
    expect(text).not.toContain('dashboard works!');
    expect(text).not.toContain('Hydrogen');
  });
});
