import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { Feedback } from './feedback';

describe('Feedback', () => {
  let component: Feedback;
  let fixture: ComponentFixture<Feedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Feedback],
      providers: [{
        provide: GraphQLService,
        useValue: { query: () => of({ allFeedbacks: { items: [], pagination: { totalItems: 0 } } }) },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(Feedback);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
