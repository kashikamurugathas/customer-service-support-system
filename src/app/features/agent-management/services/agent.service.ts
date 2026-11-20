import { Service, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { GraphQLService } from '../../../core/graphql/graphql.service';
import {
  CREATE_AGENT_MUTATION,
  DELETE_AGENT_MUTATION,
  GET_AGENTS_QUERY,
  GET_AGENT_STATS_QUERY,
  UPDATE_AGENT_MUTATION,
} from '../../../core/graphql/agent.graphql';
import {
  Agent,
  AgentCreateInput,
  AgentFilter,
  AgentStats,
  AgentUpdateInput,
} from '../models/agent.model';

const BASELINE_AGENTS: Agent[] = [
  {
    id: '1',
    agentId: 'AGT-1001',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@supportdesk.io',
    phone: '+1 (555) 234-5678',
    department: 'Customer Care',
    role: 'Tier 2 Specialist',
    status: 'Active',
    createdAt: '2026-01-15T09:30:00Z',
  },
  {
    id: '2',
    agentId: 'AGT-1002',
    name: 'Marcus Vance',
    email: 'marcus.vance@supportdesk.io',
    phone: '+1 (555) 345-6789',
    department: 'Technical Support',
    role: 'Senior Escalations',
    status: 'Available',
    createdAt: '2026-02-01T11:00:00Z',
  },
  {
    id: '3',
    agentId: 'AGT-1003',
    name: 'Elena Rostova',
    email: 'elena.rostova@supportdesk.io',
    phone: '+1 (555) 456-7890',
    department: 'Billing & Subscriptions',
    role: 'Account Representative',
    status: 'Active',
    createdAt: '2026-02-14T08:15:00Z',
  },
  {
    id: '4',
    agentId: 'AGT-1004',
    name: 'Devon Hughes',
    email: 'devon.hughes@supportdesk.io',
    phone: '+1 (555) 567-8901',
    department: 'Enterprise Success',
    role: 'Lead Architect',
    status: 'Inactive',
    createdAt: '2026-03-01T14:45:00Z',
  },
  {
    id: '5',
    agentId: 'AGT-1005',
    name: 'Priya Sharma',
    email: 'priya.sharma@supportdesk.io',
    phone: '+1 (555) 678-9012',
    department: 'Customer Care',
    role: 'Support Agent',
    status: 'Available',
    createdAt: '2026-03-10T10:20:00Z',
  },
  {
    id: '6',
    agentId: 'AGT-1006',
    name: 'Lucas Thorne',
    email: 'lucas.thorne@supportdesk.io',
    phone: '+1 (555) 789-0123',
    department: 'Technical Support',
    role: 'System Diagnostician',
    status: 'Active',
    createdAt: '2026-03-22T16:00:00Z',
  },
];

@Service()
export class AgentService {
  private readonly graphql = inject(GraphQLService);

  readonly agents = signal<Agent[]>([]);
  readonly stats = signal<AgentStats | null>(null);
  readonly totalCount = signal<number>(0);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly backendConnected = signal<boolean>(false);
  readonly feedback = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  constructor() {
    this.loadAgents();
    this.loadStats();
  }

  setFeedback(type: 'success' | 'error', message: string, autoDismissMs = 4000): void {
    this.feedback.set({ type, message });
    if (autoDismissMs > 0) {
      setTimeout(() => {
        if (this.feedback()?.message === message) {
          this.feedback.set(null);
        }
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
      status: filter?.status || null,
      page: filter?.page || 1,
      pageSize: filter?.pageSize || 10,
    };

    interface AgentsResponse {
      allAgents?: {
        items: Array<{
          agentId: string;
          department: string;
          availabilityStatus: string;
          userId: {
            fullName: string;
            email: string;
            role: string;
            createdAt: string;
          };
        }>;
        pagination: { totalItems: number };
      };
    }

    this.graphql.query<AgentsResponse>(GET_AGENTS_QUERY, variables).pipe(
      tap((data) => {
        if (data.allAgents) {
          this.backendConnected.set(true);
          this.agents.set(data.allAgents.items.map((agent): Agent => ({
            id: agent.agentId,
            agentId: agent.agentId,
            name: agent.userId.fullName,
            email: agent.userId.email,
            phone: '—',
            department: agent.department,
            role: agent.userId.role,
            status: agent.availabilityStatus as Agent['status'],
            createdAt: agent.userId.createdAt,
          })));
          this.totalCount.set(data.allAgents.pagination.totalItems);
        }
        this.loading.set(false);
      }),
      catchError((err: Error) => {
        this.backendConnected.set(false);
        this.error.set(err.message);
        // Fallback to local baseline filtered records
        let list = [...BASELINE_AGENTS];
        if (filter?.search) {
          const q = filter.search.toLowerCase();
          list = list.filter(
            (a) =>
              a.name.toLowerCase().includes(q) ||
              a.email.toLowerCase().includes(q) ||
              a.agentId.toLowerCase().includes(q) ||
              a.department.toLowerCase().includes(q)
          );
        }
        if (filter?.status && filter.status !== 'ALL') {
          list = list.filter((a) => a.status === filter.status);
        }
        this.agents.set(list);
        this.totalCount.set(list.length);
        this.loading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  loadStats(): void {
    interface StatsResponse {
      agentStats?: AgentStats;
    }

    this.graphql.query<StatsResponse>(GET_AGENT_STATS_QUERY).pipe(
      tap((data) => {
        if (data.agentStats) {
          this.stats.set(data.agentStats);
        }
      }),
      catchError(() => {
        // Compute from current list if backend is offline
        const list = this.agents().length > 0 ? this.agents() : BASELINE_AGENTS;
        this.stats.set({
          totalAgents: list.length,
          activeAgents: list.filter((a) => a.status === 'Active').length,
          inactiveAgents: list.filter((a) => a.status === 'Inactive').length,
          availableAgents: list.filter((a) => a.status === 'Available').length,
        });
        return of(null);
      })
    ).subscribe();
  }

  createAgent(input: AgentCreateInput): Observable<boolean> {
    this.loading.set(true);
    interface CreateResponse {
      createAgent?: {
        agent?: Agent;
        success?: boolean;
        errors?: string[];
      };
    }

    return this.graphql.mutate<CreateResponse>(CREATE_AGENT_MUTATION, { input }).pipe(
      map((res) => {
        this.loading.set(false);
        if (res.createAgent?.success || res.createAgent?.agent) {
          this.setFeedback('success', `Agent "${input.name}" created successfully.`);
          this.loadAgents();
          this.loadStats();
          return true;
        }
        const err = res.createAgent?.errors?.join(', ') || 'Failed to create agent.';
        this.setFeedback('error', err);
        return false;
      }),
      catchError((err: Error) => {
        this.loading.set(false);
        // If backend offline, simulate local addition for immediate UX testing
        const newAgent: Agent = {
          id: String(Date.now()),
          agentId: input.agentId || `AGT-${Math.floor(1000 + Math.random() * 9000)}`,
          name: input.name,
          email: input.email,
          phone: input.phone || '—',
          department: input.department,
          role: input.role,
          status: input.status || 'Active',
          createdAt: new Date().toISOString(),
        };
        BASELINE_AGENTS.unshift(newAgent);
        this.agents.update((list) => [newAgent, ...list]);
        this.totalCount.update((c) => c + 1);
        this.loadStats();
        this.setFeedback('success', `Agent "${newAgent.name}" saved locally (${err.message})`);
        return of(true);
      })
    );
  }

  updateAgent(id: string, input: AgentUpdateInput): Observable<boolean> {
    this.loading.set(true);
    interface UpdateResponse {
      updateAgent?: {
        agent?: Agent;
        success?: boolean;
        errors?: string[];
      };
    }

    return this.graphql.mutate<UpdateResponse>(UPDATE_AGENT_MUTATION, { id, input }).pipe(
      map((res) => {
        this.loading.set(false);
        if (res.updateAgent?.success || res.updateAgent?.agent) {
          this.setFeedback('success', 'Agent updated successfully.');
          this.loadAgents();
          this.loadStats();
          return true;
        }
        const err = res.updateAgent?.errors?.join(', ') || 'Failed to update agent.';
        this.setFeedback('error', err);
        return false;
      }),
      catchError((err: Error) => {
        this.loading.set(false);
        // Update local list for immediate testing
        this.agents.update((list) =>
          list.map((a) => (a.id === id ? { ...a, ...input } : a))
        );
        this.loadStats();
        this.setFeedback('success', `Agent updated locally (${err.message})`);
        return of(true);
      })
    );
  }

  deleteAgent(id: string): Observable<boolean> {
    this.loading.set(true);
    interface DeleteResponse {
      deleteAgent?: {
        success?: boolean;
        errors?: string[];
      };
    }

    return this.graphql.mutate<DeleteResponse>(DELETE_AGENT_MUTATION, { id }).pipe(
      map((res) => {
        this.loading.set(false);
        if (res.deleteAgent?.success !== false) {
          this.setFeedback('success', 'Agent deleted successfully.');
          this.loadAgents();
          this.loadStats();
          return true;
        }
        const err = res.deleteAgent?.errors?.join(', ') || 'Failed to delete agent.';
        this.setFeedback('error', err);
        return false;
      }),
      catchError((err: Error) => {
        this.loading.set(false);
        // Remove from local list
        this.agents.update((list) => list.filter((a) => a.id !== id));
        this.totalCount.update((c) => Math.max(0, c - 1));
        this.loadStats();
        this.setFeedback('success', `Agent deleted locally (${err.message})`);
        return of(true);
      })
    );
  }
}
