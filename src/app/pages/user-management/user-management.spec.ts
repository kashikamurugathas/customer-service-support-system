import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { UserManagement } from './user-management';

describe('UserManagement', () => {
  let component: UserManagement;
  let fixture: ComponentFixture<UserManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagement],
      providers: [{
        provide: GraphQLService,
        useValue: {
          query: (_document: string, variables?: { page?: number }) => of({
            allUsers: {
              items: variables?.page === 1
                ? [{ userId: 1, fullName: 'First User', email: 'first@example.test', role: 'Agent', accountStatus: 'Active', createdAt: '2026-01-01' }]
                : [{ userId: 2, fullName: 'Second User', email: 'second@example.test', role: 'Customer', accountStatus: 'Active', createdAt: '2026-01-02' }],
              pagination: { totalPages: 2 },
            },
          }),
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create and load records across all backend pages', () => {
    expect(component).toBeTruthy();
    expect(component.users().map((user) => user.userId)).toEqual([1, 2]);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
  });
});
