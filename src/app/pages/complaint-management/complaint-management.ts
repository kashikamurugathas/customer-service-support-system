import { Component, inject, signal } from '@angular/core';
import { EMPTY, Subscription, catchError, map } from 'rxjs';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { PaginatedGraphQLResult } from '../../core/graphql/graphql.types';
import { GET_COMPLAINTS_QUERY } from '../../core/graphql/management.graphql';
import { DataTable, TableColumn } from '../../shared/components/data-table/data-table';

interface ComplaintRecord {
  complaintId: number | null;
  complaintSubject: string | null;
  complaintDescription: string | null;
  complaintCategory: string | null;
  complaintValue: string | null;
  source: string | null;
  sentiment: string | null;
  status: string | null;
  createdAt: string | null;
  customer: {
    customerId: number | null;
    userId: { fullName: string | null; email: string | null } | null;
  } | null;
}

interface ComplaintRow extends Record<string, unknown> {
  complaintId: number | null;
  subject: string | null;
  description: string | null;
  customerName: string | null;
  email: string | null;
  category: string | null;
  value: string | null;
  source: string | null;
  sentiment: string | null;
  status: string | null;
  createdAt: string | null;
}

interface ComplaintsResponse {
  allComplaints?: PaginatedGraphQLResult<ComplaintRecord> | null;
}

@Component({
  selector: 'app-complaint-management',
  imports: [DataTable],
  styleUrl: './complaint-management.css',
  templateUrl: './complaint-management.html',
})
export class ComplaintManagement {
  private readonly graphql = inject(GraphQLService);
  private request?: Subscription;

  readonly columns: TableColumn<ComplaintRow>[] = [
    { key: 'complaintId', label: 'Complaint ID', type: 'number' },
    { key: 'subject', label: 'Subject', truncate: true },
    { key: 'description', label: 'Description', truncate: true },
    { key: 'customerName', label: 'Customer' },
    { key: 'email', label: 'Email' },
    { key: 'category', label: 'Category' },
    { key: 'value', label: 'Value' },
    { key: 'source', label: 'Source' },
    { key: 'sentiment', label: 'Sentiment' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'createdAt', label: 'Created', type: 'date' },
  ];

  readonly complaints = signal<ComplaintRow[]>([]);
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

    this.request = this.graphql.query<ComplaintsResponse>(GET_COMPLAINTS_QUERY, {
      search: this.search() || null,
      status: null,
      page: this.page(),
      pageSize: this.pageSize(),
    }).pipe(
      map((response) => {
        const result = response.allComplaints;
        if (!result) throw new Error('The backend returned no complaint list.');
        return result;
      }),
      catchError((error: unknown) => {
        this.error.set(error instanceof Error ? error.message : String(error));
        this.complaints.set([]);
        this.totalRecords.set(0);
        this.loading.set(false);
        return EMPTY;
      })
    ).subscribe((result) => {
      this.complaints.set((result.items ?? []).filter((complaint): complaint is ComplaintRecord => complaint !== null).map((complaint) => ({
        complaintId: complaint.complaintId,
        subject: complaint.complaintSubject,
        description: complaint.complaintDescription,
        customerName: complaint.customer?.userId?.fullName ?? null,
        email: complaint.customer?.userId?.email ?? null,
        category: complaint.complaintCategory,
        value: complaint.complaintValue,
        source: complaint.source,
        sentiment: complaint.sentiment,
        status: complaint.status,
        createdAt: complaint.createdAt,
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
