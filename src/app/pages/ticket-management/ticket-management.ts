import { Component, inject, signal } from '@angular/core';
import { EMPTY, Subscription, catchError, map } from 'rxjs';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { PaginatedGraphQLResult } from '../../core/graphql/graphql.types';
import { GET_TICKETS_QUERY } from '../../core/graphql/management.graphql';
import { DataTable, TableColumn } from '../../shared/components/data-table/data-table';

interface TicketRecord {
  ticketId: number | null;
  ticketNumber: string | null;
  ticketStatus: string | null;
  createdAt: string | null;
  resolvedAt: string | null;
  complaint: { complaintSubject: string | null; customer: { userId: { fullName: string | null } | null } | null } | null;
  priority: { priorityName: string | null } | null;
}

interface TicketRow extends Record<string, unknown> {
  ticketId: number | null;
  ticketNumber: string | null;
  customerName: string | null;
  subject: string | null;
  ticketStatus: string | null;
  priorityName: string | null;
  createdAt: string | null;
  resolvedAt: string | null;
}

interface TicketsResponse {
  allTickets?: PaginatedGraphQLResult<TicketRecord> | null;
}

@Component({
  selector: 'app-ticket-management',
  imports: [DataTable],
  styleUrl: './ticket-management.css',
  templateUrl: './ticket-management.html',
})
export class TicketManagement {
  private readonly graphql = inject(GraphQLService);
  private request?: Subscription;

  readonly columns: TableColumn<TicketRow>[] = [
    { key: 'ticketNumber', label: 'Ticket', truncate: true },
    { key: 'customerName', label: 'Customer' },
    { key: 'subject', label: 'Subject', truncate: true },
    { key: 'priorityName', label: 'Priority', type: 'priority' },
    { key: 'ticketStatus', label: 'Status', type: 'badge' },
    { key: 'createdAt', label: 'Created', type: 'date' },
    { key: 'resolvedAt', label: 'Resolved', type: 'date' },
  ];

  readonly tickets = signal<TicketRow[]>([]);
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

    this.request = this.graphql.query<TicketsResponse>(GET_TICKETS_QUERY, {
      search: this.search() || null,
      status: null,
      page: this.page(),
      pageSize: this.pageSize(),
    }).pipe(
      map((response) => {
        const result = response.allTickets;
        if (!result) throw new Error('The backend returned no ticket list.');
        return result;
      }),
      catchError((error: unknown) => {
        this.error.set(error instanceof Error ? error.message : String(error));
        this.tickets.set([]);
        this.totalRecords.set(0);
        this.loading.set(false);
        return EMPTY;
      })
    ).subscribe((result) => {
      this.tickets.set((result.items ?? []).filter((ticket): ticket is TicketRecord => ticket !== null).map((ticket) => ({
        ticketId: ticket.ticketId,
        ticketNumber: ticket.ticketNumber,
        customerName: ticket.complaint?.customer?.userId?.fullName ?? null,
        subject: ticket.complaint?.complaintSubject ?? null,
        ticketStatus: ticket.ticketStatus,
        priorityName: ticket.priority?.priorityName ?? null,
        createdAt: ticket.createdAt,
        resolvedAt: ticket.resolvedAt,
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
