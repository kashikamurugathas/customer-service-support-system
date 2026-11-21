import { Component, computed, inject, signal } from '@angular/core';
import { EMPTY, Subscription, catchError, map } from 'rxjs';
import { GraphQLService } from '../../core/graphql/graphql.service';
import {
  GET_SLA_RULES_QUERY,
  GET_SLA_TRACKING_QUERY,
} from '../../core/graphql/management.graphql';
import { PaginatedGraphQLResult } from '../../core/graphql/graphql.types';
import { fetchAllPages } from '../../core/graphql/pagination';
import { DataTable, TableColumn } from '../../shared/components/data-table/data-table';

interface SlaRuleRecord {
  slaRuleId: number | null;
  responseTimeMinutes: number | null;
  resolutionTimeMinutes: number | null;
  workingHours: string | null;
  plan: { planName: string | null } | null;
  priority: { priorityName: string | null } | null;
}

interface SlaTrackingRecord {
  slaTrackingId: number | null;
  responseDueAt: string | null;
  resolutionDueAt: string | null;
  responseStatus: string | null;
  resolutionStatus: string | null;
  ticket: { ticketNumber: string | null } | null;
  slaRule: {
    responseTimeMinutes: number | null;
    resolutionTimeMinutes: number | null;
    plan: { planName: string | null } | null;
    priority: { priorityName: string | null } | null;
  } | null;
}

interface SlaRow extends Record<string, unknown> {
  recordId: number | null;
  ticketNumber: string | null;
  planName: string | null;
  priorityName: string | null;
  responseTimeMinutes: number | null;
  resolutionTimeMinutes: number | null;
  workingHours: string | null;
  responseDueAt: string | null;
  resolutionDueAt: string | null;
  responseStatus: string | null;
  resolutionStatus: string | null;
}

interface SlaRulesResponse {
  allSlaRules?: PaginatedGraphQLResult<SlaRuleRecord> | null;
}

interface SlaTrackingResponse {
  allSlaTracking?: PaginatedGraphQLResult<SlaTrackingRecord> | null;
}

@Component({
  selector: 'app-service-level-agreement-management',
  imports: [DataTable],
  styleUrl: './service-level-agreement-management.css',
  templateUrl: './service-level-agreement-management.html',
})
export class ServiceLevelAgreementManagement {
  private readonly graphql = inject(GraphQLService);
  private rulesRequest?: Subscription;
  private trackingRequest?: Subscription;

  readonly activeView = signal<'rules' | 'tracking'>('rules');
  readonly rules = signal<SlaRow[]>([]);
  readonly tracking = signal<SlaRow[]>([]);
  readonly rulesLoading = signal(false);
  readonly trackingLoading = signal(false);
  readonly rulesError = signal<string | null>(null);
  readonly trackingError = signal<string | null>(null);
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly search = signal('');

  readonly activeRows = computed(() =>
    this.activeView() === 'rules' ? this.rules() : this.tracking()
  );
  readonly loading = computed(() =>
    this.activeView() === 'rules' ? this.rulesLoading() : this.trackingLoading()
  );
  readonly error = computed(() =>
    this.activeView() === 'rules' ? this.rulesError() : this.trackingError()
  );
  readonly columns = computed<TableColumn<SlaRow>[]>(() =>
    this.activeView() === 'rules' ? this.ruleColumns : this.trackingColumns
  );

  private readonly ruleColumns: TableColumn<SlaRow>[] = [
    { key: 'recordId', label: 'Rule ID', type: 'number' },
    { key: 'planName', label: 'Plan' },
    { key: 'priorityName', label: 'Priority', type: 'priority' },
    { key: 'responseTimeMinutes', label: 'Response (min)', type: 'number' },
    { key: 'resolutionTimeMinutes', label: 'Resolution (min)', type: 'number' },
    { key: 'workingHours', label: 'Working Hours' },
  ];

  private readonly trackingColumns: TableColumn<SlaRow>[] = [
    { key: 'recordId', label: 'Tracking ID', type: 'number' },
    { key: 'ticketNumber', label: 'Ticket' },
    { key: 'planName', label: 'Plan' },
    { key: 'priorityName', label: 'Priority', type: 'priority' },
    { key: 'responseDueAt', label: 'Response Due', type: 'date' },
    { key: 'responseStatus', label: 'Response Status', type: 'badge' },
    { key: 'resolutionDueAt', label: 'Resolution Due', type: 'date' },
    { key: 'resolutionStatus', label: 'Resolution Status', type: 'badge' },
  ];

  constructor() {
    this.loadRules();
    this.loadTracking();
  }

  selectView(view: 'rules' | 'tracking'): void {
    this.activeView.set(view);
    this.page.set(1);
  }

  retryActiveView(): void {
    if (this.activeView() === 'rules') this.loadRules();
    else this.loadTracking();
  }

  loadRules(): void {
    this.rulesRequest?.unsubscribe();
    this.rulesLoading.set(true);
    this.rulesError.set(null);

    this.rulesRequest = fetchAllPages((page, pageSize) =>
      this.graphql.query<SlaRulesResponse>(GET_SLA_RULES_QUERY, { page, pageSize }).pipe(
        map((response) => {
          const result = response.allSlaRules;
          if (!result) throw new Error('The backend returned no SLA rule list.');
          return result;
        })
      )
    ).pipe(
      map((records) => records.map((rule) => ({
        recordId: rule.slaRuleId,
        ticketNumber: null,
        planName: rule.plan?.planName ?? null,
        priorityName: rule.priority?.priorityName ?? null,
        responseTimeMinutes: rule.responseTimeMinutes,
        resolutionTimeMinutes: rule.resolutionTimeMinutes,
        workingHours: rule.workingHours,
        responseDueAt: null,
        resolutionDueAt: null,
        responseStatus: null,
        resolutionStatus: null,
      }))),
      catchError((error: unknown) => {
        this.rulesError.set(error instanceof Error ? error.message : String(error));
        this.rules.set([]);
        this.rulesLoading.set(false);
        return EMPTY;
      })
    ).subscribe((rows) => {
      this.rules.set(rows);
      this.rulesLoading.set(false);
    });
  }

  loadTracking(): void {
    this.trackingRequest?.unsubscribe();
    this.trackingLoading.set(true);
    this.trackingError.set(null);

    this.trackingRequest = fetchAllPages((page, pageSize) =>
      this.graphql.query<SlaTrackingResponse>(GET_SLA_TRACKING_QUERY, { page, pageSize }).pipe(
        map((response) => {
          const result = response.allSlaTracking;
          if (!result) throw new Error('The backend returned no SLA tracking list.');
          return result;
        })
      )
    ).pipe(
      map((records) => records.map((entry) => ({
        recordId: entry.slaTrackingId,
        ticketNumber: entry.ticket?.ticketNumber ?? null,
        planName: entry.slaRule?.plan?.planName ?? null,
        priorityName: entry.slaRule?.priority?.priorityName ?? null,
        responseTimeMinutes: entry.slaRule?.responseTimeMinutes ?? null,
        resolutionTimeMinutes: entry.slaRule?.resolutionTimeMinutes ?? null,
        workingHours: null,
        responseDueAt: entry.responseDueAt,
        resolutionDueAt: entry.resolutionDueAt,
        responseStatus: entry.responseStatus,
        resolutionStatus: entry.resolutionStatus,
      }))),
      catchError((error: unknown) => {
        this.trackingError.set(error instanceof Error ? error.message : String(error));
        this.tracking.set([]);
        this.trackingLoading.set(false);
        return EMPTY;
      })
    ).subscribe((rows) => {
      this.tracking.set(rows);
      this.trackingLoading.set(false);
    });
  }
}
