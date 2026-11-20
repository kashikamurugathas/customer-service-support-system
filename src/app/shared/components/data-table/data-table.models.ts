export type ColumnType = 'text' | 'badge' | 'priority' | 'actions' | 'date' | 'number';

export interface TableColumn<T = Record<string, unknown>> {
  /** Property key of the row object or unique identifier */
  key: string;
  /** Header label displayed to the user */
  label: string;
  /** Whether the column can be sorted. Defaults to true for non-action columns */
  sortable?: boolean;
  /** Whether the column is included in text search filtering. Defaults to true */
  searchable?: boolean;
  /** Column data type for specialized cell rendering */
  type?: ColumnType;
  /** Column width style (e.g. '140px', '20%') */
  width?: string;
  /** Maximum width for cell text before truncating (e.g. '240px') */
  maxWidth?: string;
  /** Alignment of column text and headers */
  align?: 'left' | 'center' | 'right';
  /** Whether long text should be truncated with an ellipsis and hover tooltip. Defaults to false */
  truncate?: boolean;
  /** Optional custom CSS class mapping for badge values: { 'Active': 'badge-success', ... } */
  badgeClassMap?: Record<string, string>;
  /** Optional custom value formatter function */
  formatter?: (value: unknown, row: T) => string;
}

export interface TableActionConfig {
  /** Show the View action button. Defaults to true */
  view?: boolean;
  /** Show the Edit action button. Defaults to true */
  edit?: boolean;
  /** Show the Delete action button. Defaults to true */
  delete?: boolean;
}

export interface TableActionEvent<T = Record<string, unknown>> {
  action: 'view' | 'edit' | 'delete' | string;
  row: T;
}

export interface TableSortEvent {
  key: string;
  direction: 'asc' | 'desc' | null;
}
