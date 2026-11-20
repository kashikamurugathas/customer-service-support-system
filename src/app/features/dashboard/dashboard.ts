import { Component, inject, signal } from '@angular/core';
import { DataTable, TableColumn } from '../../shared/components/data-table/data-table';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { catchError, of, tap } from 'rxjs';

interface TicketRow extends Record<string, unknown> {
  ticketNumber: string;
  customerName: string;
  subject: string;
  status: string;
  priority: string;
}

interface TicketsResponse {
  allTickets?: {
    items: Array<{
      ticketNumber: string;
      ticketStatus: string;
      priority: { priorityName: string };
      complaint: {
        complaintSubject: string;
        customer: { userId: { fullName: string } };
      };
    }>;
    pagination: { totalItems: number };
  };
}

const RECENT_TICKETS_QUERY = `
  query RecentTickets($page: Int, $pageSize: Int) {
    allTickets(page: $page, pageSize: $pageSize) {
      items {
        ticketNumber
        ticketStatus
        priority { priorityName }
        complaint {
          complaintSubject
          customer { userId { fullName } }
        }
      }
      pagination { totalItems }
    }
  }
`;

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
    this.loading.set(true);
    this.graphql.query<TicketsResponse>(RECENT_TICKETS_QUERY, { page: 1, pageSize: 5 }).pipe(
      tap((response) => {
        const result = response.allTickets;
        if (!result) throw new Error('The backend returned no ticket list.');
        this.totalTickets.set(result.pagination.totalItems);
        this.tickets.set(result.items.map((ticket) => ({
          ticketNumber: ticket.ticketNumber,
          customerName: ticket.complaint.customer.userId.fullName,
          subject: ticket.complaint.complaintSubject,
          status: ticket.ticketStatus,
          priority: ticket.priority.priorityName,
        })));
        this.loading.set(false);
      }),
      catchError((error: Error) => {
        this.error.set(error.message);
        this.loading.set(false);
        return of(null);
      })
    ).subscribe();
  }
}
