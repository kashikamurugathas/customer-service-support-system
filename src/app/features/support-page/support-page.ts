import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { DataTable, TableColumn } from '../../shared/components/data-table/data-table';

interface SupportPageConfig {
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  columns: TableColumn[];
  rows: Record<string, unknown>[];
}

@Component({
  selector: 'app-support-page',
  imports: [DataTable, RouterLink, UpperCasePipe],
  templateUrl: './support-page.html',
  styleUrl: './support-page.css',
})
export class SupportPage {
  private readonly route = inject(ActivatedRoute);
  readonly page = this.route.snapshot.data['page'] as SupportPageConfig;
  readonly query = signal(this.route.snapshot.queryParamMap.get('search') ?? '');
  readonly filteredRows = computed(() => {
    const query = this.query().trim().toLowerCase();
    if (!query) return this.page.rows;
    return this.page.rows.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(query)));
  });

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
