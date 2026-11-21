import { Component, inject, signal } from '@angular/core';
import { EMPTY, Subscription, catchError, map } from 'rxjs';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { GET_USERS_QUERY } from '../../core/graphql/management.graphql';
import { PaginatedGraphQLResult } from '../../core/graphql/graphql.types';
import { fetchAllPages } from '../../core/graphql/pagination';
import { DataTable, TableColumn } from '../../shared/components/data-table/data-table';

interface UserRecord {
  userId: number | null;
  fullName: string | null;
  email: string | null;
  role: string | null;
  accountStatus: string | null;
  createdAt: string | null;
}

interface UserRow extends Record<string, unknown> {
  userId: number | null;
  fullName: string | null;
  email: string | null;
  role: string | null;
  accountStatus: string | null;
  createdAt: string | null;
}

interface UsersResponse {
  allUsers?: PaginatedGraphQLResult<UserRecord> | null;
}

@Component({
  selector: 'app-user-management',
  imports: [DataTable],
  templateUrl: './user-management.html',
})
export class UserManagement {
  private readonly graphql = inject(GraphQLService);
  private request?: Subscription;

  readonly columns: TableColumn<UserRow>[] = [
    { key: 'userId', label: 'User ID', type: 'number' },
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'accountStatus', label: 'Account Status', type: 'badge' },
    { key: 'createdAt', label: 'Created', type: 'date' },
  ];

  readonly users = signal<UserRow[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.request?.unsubscribe();
    this.loading.set(true);
    this.error.set(null);

    this.request = fetchAllPages((page, pageSize) =>
      this.graphql.query<UsersResponse>(GET_USERS_QUERY, { page, pageSize }).pipe(
        map((response) => {
          const result = response.allUsers;
          if (!result) throw new Error('The backend returned no user list.');
          return result;
        })
      )
    ).pipe(
      map((records) => records.map((user) => ({
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        createdAt: user.createdAt,
      }))),
      catchError((error: unknown) => {
        this.error.set(error instanceof Error ? error.message : String(error));
        this.users.set([]);
        this.loading.set(false);
        return EMPTY;
      })
    ).subscribe((users) => {
      this.users.set(users);
      this.loading.set(false);
    });
  }
}
