import { Service, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GraphQLRequestPayload, GraphQLResponse } from './graphql.types';

@Service()
export class GraphQLService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = environment.graphqlUri;

  
  query<T, V extends Record<string, unknown> = Record<string, unknown>>(
    query: string,
    variables?: V
  ): Observable<T> {
    return this.execute<T, V>({ query, variables });
  }


  mutate<T, V extends Record<string, unknown> = Record<string, unknown>>(
    mutation: string,
    variables?: V
  ): Observable<T> {
    return this.execute<T, V>({ query: mutation, variables });
  }

  private execute<T, V extends Record<string, unknown>>(
    payload: GraphQLRequestPayload<V>
  ): Observable<T> {
    return this.http.post<GraphQLResponse<T>>(this.endpoint, payload).pipe(
      map((response) => {
        if (response.errors && response.errors.length > 0) {
          const messages = response.errors.map((err) => err.message).join('; ');
          throw new Error(`GraphQL Error: ${messages}`);
        }
        if (!response.data) {
          throw new Error('GraphQL response returned empty data.');
        }
        return response.data;
      }),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          let errorMsg = `Network Error (${error.status}): ${error.statusText || 'Unable to connect to backend'}`;
          if (error.status === 0) {
            errorMsg = 'Cannot reach backend at ' + this.endpoint + '. Please ensure the Django GraphQL server is running.';
          } else if (error.error?.errors) {
            const gqlErrors = error.error.errors.map((e: { message: string }) => e.message).join('; ');
            errorMsg = `GraphQL Error: ${gqlErrors}`;
          }
          return throwError(() => new Error(errorMsg));
        }
        return throwError(() => (error instanceof Error ? error : new Error(String(error))));
      })
    );
  }
}
