import { Component, inject, signal } from '@angular/core';
import { EMPTY, Subscription, catchError, map } from 'rxjs';
import { GraphQLService } from '../../core/graphql/graphql.service';
import { PaginatedGraphQLResult } from '../../core/graphql/graphql.types';
import { GET_FEEDBACK_QUERY } from '../../core/graphql/management.graphql';
import { DataTable, TableColumn } from '../../shared/components/data-table/data-table';

interface FeedbackRecord {
  feedbackId: number | null;
  rating: number | null;
  feedbackComments: string | null;
  createdAt: string | null;
  ticket: { ticketNumber: string | null } | null;
  customer: {
    customerId: number | null;
    userId: { fullName: string | null } | null;
  } | null;
}

interface FeedbackRow extends Record<string, unknown> {
  feedbackId: number | null;
  customerName: string | null;
  ticketNumber: string | null;
  rating: number | null;
  feedbackComments: string | null;
  createdAt: string | null;
}

interface FeedbackResponse {
  allFeedbacks?: PaginatedGraphQLResult<FeedbackRecord> | null;
}

@Component({
  selector: 'app-feedback',
  imports: [DataTable],
  styleUrl: './feedback.css',
  templateUrl: './feedback.html',
})
export class Feedback {
  private readonly graphql = inject(GraphQLService);
  private request?: Subscription;

  readonly columns: TableColumn<FeedbackRow>[] = [
    { key: 'feedbackId', label: 'Feedback ID', type: 'number' },
    { key: 'customerName', label: 'Customer' },
    { key: 'ticketNumber', label: 'Ticket' },
    { key: 'rating', label: 'Rating', type: 'number' },
    { key: 'feedbackComments', label: 'Comments', truncate: true },
    { key: 'createdAt', label: 'Submitted', type: 'date' },
  ];

  readonly feedback = signal<FeedbackRow[]>([]);
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

    this.request = this.graphql.query<FeedbackResponse>(GET_FEEDBACK_QUERY, {
      search: this.search() || null,
      rating: null,
      page: this.page(),
      pageSize: this.pageSize(),
    }).pipe(
      map((response) => {
        const result = response.allFeedbacks;
        if (!result) throw new Error('The backend returned no feedback list.');
        return result;
      }),
      catchError((error: unknown) => {
        this.error.set(error instanceof Error ? error.message : String(error));
        this.feedback.set([]);
        this.totalRecords.set(0);
        this.loading.set(false);
        return EMPTY;
      })
    ).subscribe((result) => {
      this.feedback.set((result.items ?? []).filter((entry): entry is FeedbackRecord => entry !== null).map((entry) => ({
        feedbackId: entry.feedbackId,
        customerName: entry.customer?.userId?.fullName ?? null,
        ticketNumber: entry.ticket?.ticketNumber ?? null,
        rating: entry.rating,
        feedbackComments: entry.feedbackComments,
        createdAt: entry.createdAt,
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
