import { Service, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { GraphQLService } from '../../../core/graphql/graphql.service';
import { GET_AGENTS_QUERY } from '../../../core/graphql/agent.graphql';
import {
  Agent,
  AgentCreateInput,
  AgentFilter,
  AgentStats,
  AgentUpdateInput,
} from '../models/agent.model';

interface AgentsResponse {
  allAgents?: {
    items: Array<{
      agentId: number;
      department: string;
      availabilityStatus: string;
      userId: { fullName: string; email: string; role: string; createdAt: string };
    }>;
    pagination: { totalItems: number };
  };
}

@Service()
export class AgentService {
  private readonly graphql = inject(GraphQLService);

  readonly agents = signal<Agent[]>([]);
  readonly availableStatuses = signal<string[]>([]);
  readonly stats = signal<AgentStats | null>(null);
  readonly totalCount = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly backendConnected = signal(false);
  readonly feedback = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  constructor() {
    this.loadAgents();
  }

  setFeedback(type: 'success' | 'error', message: string, autoDismissMs = 4000): void {
    this.feedback.set({ type, message });
    if (autoDismissMs > 0) {
      setTimeout(() => {
        if (this.feedback()?.message === message) this.feedback.set(null);
      }, autoDismissMs);
    }
  }

  clearFeedback(): void {
    this.feedback.set(null);
  }

  loadAgents(filter?: Partial<AgentFilter>): void {
    this.loading.set(true);
    this.error.set(null);
    const variables = {
      search: filter?.search || null,
      status: filter?.status && filter.status !== 'ALL' ? filter.status : null,
      page: filter?.page || 1,
      pageSize: filter?.pageSize || 10,
    };

    this.graphql.query<AgentsResponse>(GET_AGENTS_QUERY, variables).pipe(
      tap((data) => {
        const result = data.allAgents;
        if (!result) throw new Error('The backend returned no agent list.');
        this.backendConnected.set(true);
        const agents = result.items.map((agent): Agent => ({
          id: String(agent.agentId),
          agentId: String(agent.agentId),
          name: agent.userId.fullName,
          email: agent.userId.email,
          phone: '—',
          department: agent.department,
          role: agent.userId.role,
          status: agent.availabilityStatus as Agent['status'],
          createdAt: agent.userId.createdAt,
        }));
        this.agents.set(agents);
        if (!variables.status) {
          this.availableStatuses.set(
            [...new Set(agents.map((agent) => agent.status))].sort()
          );
        }
        this.totalCount.set(result.pagination.totalItems);
        this.stats.set(null);
        this.loading.set(false);
      }),
      catchError((err: Error) => {
        this.backendConnected.set(false);
        this.error.set(err.message);
        this.agents.set([]);
        this.stats.set(null);
        this.totalCount.set(0);
        this.loading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  loadStats(): void {
    // Agent statistics are not exposed by the Django GraphQL schema.
    this.loadAgents();
  }

  createAgent(_input: AgentCreateInput): Observable<boolean> {
    return this.unsupportedWrite('create');
  }

  updateAgent(_id: string, _input: AgentUpdateInput): Observable<boolean> {
    return this.unsupportedWrite('update');
  }

  deleteAgent(_id: string): Observable<boolean> {
    return this.unsupportedWrite('delete');
  }

  private unsupportedWrite(operation: string): Observable<boolean> {
    this.setFeedback(
      'error',
      `Cannot ${operation} an agent: the Django GraphQL schema currently exposes queries only.`
    );
    return of(false);
  }
}
