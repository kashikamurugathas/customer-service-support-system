import { Component, inject, signal } from '@angular/core';
import { DataTable, TableColumn } from '../../shared/components/data-table/data-table';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { GET_TICKETS_QUERY } from '../../core/graphql/management.graphql';
import { EMPTY, catchError, map } from 'rxjs';

interface TicketRow extends Record<string, unknown> {
  ticketNumber: string | null;
  customerName: string | null;
  subject: string | null;
  status: string | null;
  priority: string | null;
}

interface TicketsResponse {
  allTickets?: {
    items?: Array<{
      ticketNumber: string | null;
      ticketStatus: string | null;
      priority: { priorityName: string | null } | null;
      complaint: {
        complaintSubject: string | null;
        customer: { userId: { fullName: string | null } | null } | null;
      } | null;
    } | null> | null;
    pagination?: { totalItems?: number | null } | null;
  } | null;
}

@Component({
  selector: 'app-dashboard',
  imports: [DataTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly graphql = inject(GraphQLService);

  readonly columns: TableColumn<TicketRow>[] = [
    { key: 'ticketNumber', label: 'Ticket Number' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'subject', label: 'Subject' },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
  ];
  readonly tickets = signal<TicketRow[]>([]);
  readonly totalTickets = signal<number | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading.set(true);
    this.error.set(null);
    this.graphql.query<TicketsResponse>(GET_TICKETS_QUERY, {
      page: 1,
      pageSize: 5,
      search: null,
      status: null,
    }).pipe(
      map((response) => {
        const result = response.allTickets;
        if (!result) throw new Error('The backend returned no ticket list.');
        return result;
      }),
      catchError((error: unknown) => {
        this.error.set(error instanceof Error ? error.message : String(error));
        this.totalTickets.set(null);
        this.tickets.set([]);
        this.loading.set(false);
        return EMPTY;
      })
    ).subscribe((result) => {
        this.totalTickets.set(result.pagination?.totalItems ?? null);
        this.tickets.set((result.items ?? []).filter((ticket) => ticket !== null).map((ticket) => ({
          ticketNumber: ticket.ticketNumber,
          customerName: ticket.complaint?.customer?.userId?.fullName ?? null,
          subject: ticket.complaint?.complaintSubject ?? null,
          status: ticket.ticketStatus,
          priority: ticket.priority?.priorityName ?? null,
        })));
        this.loading.set(false);
    });
  }
}
