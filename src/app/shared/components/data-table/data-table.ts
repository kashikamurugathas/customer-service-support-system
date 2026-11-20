import { Component, computed, input, model, output } from '@angular/core';
import {
  ColumnType,
  TableActionConfig,
  TableActionEvent,
  TableColumn,
  TableSortEvent,
} from './data-table.models';

export type {
  ColumnType,
  TableActionConfig,
  TableActionEvent,
  TableColumn,
  TableSortEvent,
};

@Component({
  selector: 'app-data-table',
  imports: [],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
  host: {
    class: 'data-table-host',
  },
})
export class DataTable<T extends Record<string, unknown> = Record<string, unknown>> {
  // Column definitions & input data
  readonly columns = input<TableColumn<T>[]>([]);
  readonly data = input<T[]>([]);

  // Server-side vs client-side mode
  readonly serverSide = input<boolean>(false);
  readonly totalRecords = input<number>(0);

  // Feature toggles
  readonly loading = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);
  readonly searchable = input<boolean>(true);
  readonly paginated = input<boolean>(true);
  readonly selectable = input<boolean>(false);
  readonly showActions = input<boolean>(false);
  readonly actionsConfig = input<TableActionConfig>({ view: true, edit: true, delete: true });
  readonly actionsHeader = input<string>('Actions');

  // Custom text & options
  readonly searchPlaceholder = input<string>('Search records…');
  readonly emptyTitle = input<string>('No records found');
  readonly emptyMessage = input<string>('There are no records matching your criteria.');
  readonly pageSizeOptions = input<number[]>([10, 25, 50, 100]);

  // Two-way bound models
  readonly searchQuery = model<string>('');
  readonly pageSize = model<number>(10);
  readonly currentPage = model<number>(1);
  readonly sortKey = model<string | null>(null);
  readonly sortDirection = model<'asc' | 'desc' | null>(null);
  readonly selectedRows = model<T[]>([]);

  // Action & event outputs
  readonly view = output<T>();
  readonly edit = output<T>();
  readonly delete = output<T>();
  readonly action = output<TableActionEvent<T>>();
  readonly rowClick = output<T>();
  readonly sortChange = output<TableSortEvent>();
  readonly searchChange = output<string>();
  readonly retry = output<void>();
  readonly rowSelect = output<T>();
  readonly rowDeselect = output<T>();
  readonly selectAllChange = output<T[]>();

  // Fixed count of skeleton placeholder rows during loading
  readonly skeletonRows = [1, 2, 3, 4, 5];

  readonly effectiveColumns = computed(() => {
    const cols = this.columns();
    const hasActions = cols.some((c) => c.key === 'actions' || c.type === 'actions');
    if (this.showActions() && !hasActions) {
      const actionsColumn: TableColumn<T> = {
        key: 'actions',
        label: this.actionsHeader(),
        type: 'actions',
        sortable: false,
        searchable: false,
        align: 'right',
      };
      return [...cols, actionsColumn];
    }
    return cols;
  });

  readonly filteredData = computed(() => {
    if (this.serverSide()) {
      return this.data();
    }

    const raw = this.data();
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return raw;
    }

    const searchableCols = this.effectiveColumns().filter(
      (col) => col.searchable !== false && col.key !== 'actions' && col.type !== 'actions'
    );

    return raw.filter((row) =>
      searchableCols.some((col) => {
        const val = row[col.key];
        if (val === null || val === undefined) return false;
        const text = col.formatter ? col.formatter(val, row) : String(val);
        return text.toLowerCase().includes(query);
      })
    );
  });

  readonly sortedData = computed(() => {
    if (this.serverSide()) {
      return this.filteredData();
    }

    const list = [...this.filteredData()];
    const key = this.sortKey();
    const dir = this.sortDirection();

    if (!key || !dir) {
      return list;
    }

    return list.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      let comparison = 0;
      if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      } else {
        comparison = String(valA).localeCompare(String(valB), undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      }

      return dir === 'asc' ? comparison : -comparison;
    });
  });

  readonly totalItems = computed(() => {
    if (this.serverSide()) {
      return this.totalRecords();
    }
    return this.sortedData().length;
  });

  readonly totalPages = computed(() => {
    const size = this.pageSize();
    if (size <= 0) return 1;
    return Math.max(1, Math.ceil(this.totalItems() / size));
  });

  readonly currentPageSafe = computed(() => {
    const current = this.currentPage();
    const max = this.totalPages();
    if (current > max) return max;
    if (current < 1) return 1;
    return current;
  });

  readonly pagedData = computed(() => {
    if (this.serverSide() || !this.paginated()) {
      return this.sortedData();
    }
    const page = this.currentPageSafe();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return this.sortedData().slice(start, start + size);
  });

  readonly paginationStart = computed(() => {
    if (this.totalItems() === 0) return 0;
    return (this.currentPageSafe() - 1) * this.pageSize() + 1;
  });

  readonly paginationEnd = computed(() => {
    return Math.min(this.currentPageSafe() * this.pageSize(), this.totalItems());
  });

  readonly visiblePageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPageSafe();
    const pages: (number | '...')[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);
    if (current > 3) {
      pages.push('...');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push('...');
    }
    pages.push(total);

    return pages;
  });

  readonly totalColumnCount = computed(() => {
    let count = this.effectiveColumns().length;
    if (this.selectable()) count += 1;
    return Math.max(1, count);
  });

  readonly isAllCurrentPageSelected = computed(() => {
    const pageRows = this.pagedData();
    if (pageRows.length === 0) return false;
    const selected = this.selectedRows();
    return pageRows.every((row) => selected.includes(row));
  });

  readonly isSomeCurrentPageSelected = computed(() => {
    const pageRows = this.pagedData();
    if (pageRows.length === 0) return false;
    const selected = this.selectedRows();
    const count = pageRows.filter((row) => selected.includes(row)).length;
    return count > 0 && count < pageRows.length;
  });

  isColumnSortable(column: TableColumn<T>): boolean {
    if (column.key === 'actions' || column.type === 'actions') return false;
    return column.sortable !== false;
  }

  toggleSort(column: TableColumn<T>): void {
    if (!this.isColumnSortable(column)) return;

    const currentKey = this.sortKey();
    const currentDir = this.sortDirection();

    let nextKey: string | null = column.key;
    let nextDir: 'asc' | 'desc' | null = 'asc';

    if (currentKey === column.key) {
      if (currentDir === 'asc') {
        nextDir = 'desc';
      } else if (currentDir === 'desc') {
        nextKey = null;
        nextDir = null;
      } else {
        nextDir = 'asc';
      }
    } else {
      nextKey = column.key;
      nextDir = 'asc';
    }

    this.sortKey.set(nextKey);
    this.sortDirection.set(nextDir);
    this.sortChange.emit({ key: nextKey ?? '', direction: nextDir });
  }

  getAriaSort(column: TableColumn<T>): 'ascending' | 'descending' | 'none' | null {
    if (!this.isColumnSortable(column)) return null;
    if (this.sortKey() === column.key) {
      return this.sortDirection() === 'asc'
        ? 'ascending'
        : this.sortDirection() === 'desc'
          ? 'descending'
          : 'none';
    }
    return 'none';
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.currentPage.set(1);
    this.searchChange.emit(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.searchChange.emit('');
  }

  goToPage(page: number): void {
    const max = this.totalPages();
    if (page >= 1 && page <= max) {
      this.currentPage.set(page);
    }
  }

  onPageSizeChange(event: Event): void {
    const newSize = Number((event.target as HTMLSelectElement).value);
    if (!isNaN(newSize) && newSize > 0) {
      this.pageSize.set(newSize);
      this.currentPage.set(1);
    }
  }

  isRowSelected(row: T): boolean {
    return this.selectedRows().includes(row);
  }

  toggleRowSelection(row: T, event: Event): void {
    event.stopPropagation();
    const current = this.selectedRows();
    const index = current.indexOf(row);
    let updated: T[];

    if (index >= 0) {
      updated = current.filter((r) => r !== row);
      this.selectedRows.set(updated);
      this.rowDeselect.emit(row);
    } else {
      updated = [...current, row];
      this.selectedRows.set(updated);
      this.rowSelect.emit(row);
    }

    this.selectAllChange.emit(updated);
  }

  toggleSelectAllCurrentPage(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const currentSelected = [...this.selectedRows()];
    const pageRows = this.pagedData();

    let updated: T[];
    if (checked) {
      const toAdd = pageRows.filter((r) => !currentSelected.includes(r));
      updated = [...currentSelected, ...toAdd];
    } else {
      updated = currentSelected.filter((r) => !pageRows.includes(r));
    }

    this.selectedRows.set(updated);
    this.selectAllChange.emit(updated);
  }

  clearSelection(): void {
    this.selectedRows.set([]);
    this.selectAllChange.emit([]);
  }

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  onAction(action: 'view' | 'edit' | 'delete', row: T, event: MouseEvent): void {
    event.stopPropagation();
    if (action === 'view') this.view.emit(row);
    else if (action === 'edit') this.edit.emit(row);
    else if (action === 'delete') this.delete.emit(row);

    this.action.emit({ action, row });
  }

  getColumnType(column: TableColumn<T>): ColumnType {
    if (column.type) {
      return column.type;
    }
    const keyLower = column.key.toLowerCase();
    if (keyLower === 'actions') return 'actions';
    if (keyLower === 'status' || keyLower === 'state') return 'badge';
    if (keyLower === 'priority') return 'priority';
    if (keyLower.includes('date') || keyLower.endsWith('at')) return 'date';
    if (keyLower === 'amount' || keyLower === 'total' || keyLower === 'price' || keyLower === 'count') return 'number';
    return 'text';
  }

  getBadgeClass(value: unknown, column: TableColumn<T>): string {
    const strVal = String(value ?? '').trim();
    if (column.badgeClassMap && column.badgeClassMap[strVal]) {
      return column.badgeClassMap[strVal];
    }

    const lower = strVal.toLowerCase();
    if (lower === 'open') return 'pill-open';
    if (lower === 'in progress' || lower === 'inprogress' || lower === 'in_progress' || lower === 'active' || lower === 'available') {
      return 'pill-progress';
    }
    if (lower === 'pending' || lower === 'waiting' || lower === 'on hold') return 'pill-pending';
    if (lower === 'resolved' || lower === 'completed') return 'pill-resolved';
    if (lower === 'urgent' || lower === 'closed' || lower === 'inactive' || lower === 'cancelled' || lower === 'failed' || lower === 'offline') {
      return 'pill-danger';
    }

    return 'pill-neutral';
  }

  getPriorityClass(value: unknown): string {
    const lower = String(value ?? '').trim().toLowerCase();
    if (lower === 'high' || lower === 'urgent' || lower === 'critical') return 'priority-high';
    if (lower === 'medium' || lower === 'normal' || lower === 'moderate') return 'priority-medium';
    if (lower === 'low' || lower === 'minor') return 'priority-low';
    return 'priority-neutral';
  }

  getFormattedValue(row: T, column: TableColumn<T>): string {
    const val = row[column.key];
    if (column.formatter) {
      return column.formatter(val, row);
    }
    if (val === null || val === undefined) {
      return '—';
    }
    const colType = this.getColumnType(column);
    if (colType === 'date') {
      const d = new Date(String(val));
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } else if (colType === 'number' && typeof val === 'number') {
      return val.toLocaleString();
    }
    return String(val);
  }

  getTooltipText(row: T, column: TableColumn<T>): string {
    const formatted = this.getFormattedValue(row, column);
    return formatted === '—' ? '' : formatted;
  }

  getSkeletonWidth(rowIndex: number, column: TableColumn<T>): string {
    if (column.width) return column.width;
    const widths = ['70%', '88%', '54%', '78%', '62%'];
    return widths[(rowIndex + column.key.length) % widths.length];
  }
}
