export interface GraphQLErrorLocation {
  line: number;
  column: number;
}

export interface GraphQLError {
  message: string;
  locations?: GraphQLErrorLocation[];
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

export interface GraphQLRequestPayload<V = Record<string, unknown>> {
  query: string;
  variables?: V;
  operationName?: string;
}

export interface PageInfo {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  startCursor?: string;
  endCursor?: string;
  totalCount?: number;
}

export interface GraphQLPagination {
  currentPage?: number | null;
  perPage?: number | null;
  totalPages?: number | null;
  totalItems?: number | null;
  hasNext?: boolean | null;
  hasPrevious?: boolean | null;
}

export interface PaginatedGraphQLResult<T> {
  items?: Array<T | null> | null;
  pagination?: GraphQLPagination | null;
}
