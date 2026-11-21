import { Observable, concatMap, from, map, of, reduce, switchMap } from 'rxjs';
import { PaginatedGraphQLResult } from './graphql.types';

export function fetchAllPages<T>(
  loadPage: (page: number, pageSize: number) => Observable<PaginatedGraphQLResult<T>>,
  pageSize = 100
): Observable<T[]> {
  return loadPage(1, pageSize).pipe(
    switchMap((firstPage) => {
      const firstItems = (firstPage.items ?? []).filter((item): item is T => item != null);
      const totalPages = Math.max(1, firstPage.pagination?.totalPages ?? 1);
      if (totalPages === 1) return of(firstItems);

      const remainingPages = Array.from({ length: totalPages - 1 }, (_, index) => index + 2);
      return from(remainingPages).pipe(
        concatMap((page) => loadPage(page, pageSize)),
        map((response) => (response.items ?? []).filter((item): item is T => item != null)),
        reduce((items, nextPageItems) => [...items, ...nextPageItems], firstItems)
      );
    })
  );
}
