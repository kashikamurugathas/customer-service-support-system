import { Component, inject, signal } from '@angular/core';
import { EMPTY, Subscription, catchError, map } from 'rxjs';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { GET_AGENTS_QUERY } from '../../core/graphql/agent.graphql';
import { PaginatedGraphQLResult } from '../../core/graphql/graphql.types';
import { DataTable, TableColumn } from '../../shared/components/data-table/data-table';

interface AgentRecord {
  agentId: number | null;
  department: string | null;
  availabilityStatus: string | null;
  userId: {
    fullName: string | null;
    email: string | null;
    role: string | null;
    createdAt: string | null;
  } | null;
}

interface AgentRow extends Record<string, unknown> {
  agentId: number | null;
  fullName: string | null;
  email: string | null;
  department: string | null;
  availabilityStatus: string | null;
  role: string | null;
  createdAt: string | null;
}

interface AgentsResponse {
  allAgents?: PaginatedGraphQLResult<AgentRecord> | null;
}

@Component({
  selector: 'app-agent-management',
  imports: [DataTable],
  styleUrl: './agent-management.css',
  templateUrl: './agent-management.html',
})
export class AgentManagement {
  private readonly graphql = inject(GraphQLService);
  private request?: Subscription;

  readonly columns: TableColumn<AgentRow>[] = [
    { key: 'agentId', label: 'Agent ID', type: 'number' },
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'availabilityStatus', label: 'Availability', type: 'badge' },
    { key: 'role', label: 'Role' },
    { key: 'createdAt', label: 'Created', type: 'date' },
  ];

  readonly agents = signal<AgentRow[]>([]);
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

    this.request = this.graphql.query<AgentsResponse>(GET_AGENTS_QUERY, {
      search: this.search() || null,
      status: null,
      page: this.page(),
      pageSize: this.pageSize(),
    }).pipe(
      map((response) => {
        const result = response.allAgents;
        if (!result) throw new Error('The backend returned no agent list.');
        return result;
      }),
      catchError((error: unknown) => {
        this.error.set(error instanceof Error ? error.message : String(error));
        this.agents.set([]);
        this.totalRecords.set(0);
        this.loading.set(false);
        return EMPTY;
      })
    ).subscribe((result) => {
      this.agents.set((result.items ?? []).filter((agent): agent is AgentRecord => agent !== null).map((agent) => ({
        agentId: agent.agentId,
        fullName: agent.userId?.fullName ?? null,
        email: agent.userId?.email ?? null,
        department: agent.department,
        availabilityStatus: agent.availabilityStatus,
        role: agent.userId?.role ?? null,
        createdAt: agent.userId?.createdAt ?? null,
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
