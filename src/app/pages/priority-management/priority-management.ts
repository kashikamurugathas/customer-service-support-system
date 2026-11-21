import { Component, inject, signal } from '@angular/core';
import { EMPTY, Subscription, catchError, map } from 'rxjs';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { PaginatedGraphQLResult } from '../../core/graphql/graphql.types';
import { GET_PRIORITIES_QUERY } from '../../core/graphql/management.graphql';
import { DataTable, TableColumn } from '../../shared/components/data-table/data-table';

interface PriorityRecord {
  priorityId: number | null;
  priorityName: string | null;
  priorityLevel: number | null;
  description: string | null;
}

interface PriorityRow extends Record<string, unknown> {
  priorityId: number | null;
  priorityName: string | null;
  priorityLevel: number | null;
  description: string | null;
}

interface PrioritiesResponse {
  allPriorities?: PaginatedGraphQLResult<PriorityRecord> | null;
}

@Component({
  selector: 'app-priority-management',
  imports: [DataTable],
  styleUrl: './priority-management.css',
  templateUrl: './priority-management.html',
})
export class PriorityManagement {
  private readonly graphql = inject(GraphQLService);
  private request?: Subscription;

  readonly columns: TableColumn<PriorityRow>[] = [
    { key: 'priorityId', label: 'Priority ID', type: 'number' },
    { key: 'priorityName', label: 'Priority' },
    { key: 'priorityLevel', label: 'Level', type: 'number' },
    { key: 'description', label: 'Description', truncate: true },
  ];

  readonly priorities = signal<PriorityRow[]>([]);
  readonly totalRecords = signal(0);
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly search = signal('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.request?.unsubscribe();
    this.loading.set(true);
    this.error.set(null);

    this.request = this.graphql.query<PrioritiesResponse>(GET_PRIORITIES_QUERY, {
      search: this.search() || null,
      page: this.page(),
      pageSize: this.pageSize(),
    }).pipe(
      map((response) => {
        const result = response.allPriorities;
        if (!result) throw new Error('The backend returned no priority list.');
        return result;
      }),
      catchError((error: unknown) => {
        this.error.set(error instanceof Error ? error.message : String(error));
        this.priorities.set([]);
        this.totalRecords.set(0);
        this.loading.set(false);
        return EMPTY;
      })
    ).subscribe((result) => {
      this.priorities.set((result.items ?? []).filter((priority): priority is PriorityRecord => priority !== null).map((priority) => ({
        priorityId: priority.priorityId,
        priorityName: priority.priorityName,
        priorityLevel: priority.priorityLevel,
        description: priority.description,
      })));
      this.totalRecords.set(result.pagination?.totalItems ?? 0);
      this.loading.set(false);
    });
  }

  onSearch(search: string): void {
    this.search.set(search.trim());
    this.page.set(1);
    this.load();
  }
}
