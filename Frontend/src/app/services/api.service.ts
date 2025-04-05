import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private readonly baseUrl = 'http://localhost:5014/';

  public get<T>(
    endpoint: string,
    param: number | string = '',
    queryParams?: { [key: string]: any }
  ): Observable<T> {
    const url = this.buildUrl(endpoint, param);
    const options = queryParams
      ? { params: new HttpParams({ fromObject: queryParams }) }
      : {};
    const response$ = this.http.get<T>(url, options);
    return this.handleResponse(response$);
  }

  public post<T>(
    endpoint: string,
    bodyOrParam?: any,
    queryParams?: { [key: string]: any }
  ): Observable<T> {
    return this.request('POST', endpoint, bodyOrParam, queryParams);
  }

  public patch<T>(
    endpoint: string,
    bodyOrParam?: any,
    queryParams?: { [key: string]: any }
  ): Observable<T> {
    return this.request('PATCH', endpoint, bodyOrParam, queryParams);
  }

  public delete<T>(endpoint: string, param: number): Observable<T> {
    const response$ = this.http.delete<T>(this.buildUrl(endpoint, param));
    return this.handleResponse(response$);
  }

  private buildUrl(endpoint: string, param: number | string = ''): string {
    if (param !== '') endpoint += `/${param}`;
    return `${this.baseUrl}${endpoint}`;
  }

  private request<T>(
    method: 'POST' | 'PATCH',
    endpoint: string,
    bodyOrParam?: any,
    queryParams?: { [key: string]: any }
  ): Observable<T> {
    let url = this.buildUrl(endpoint);
    let body: any = bodyOrParam;
    let options: any = {
      observe: 'body' as const,
      responseType: 'json' as const,
    };

    if (typeof bodyOrParam === 'string' || typeof bodyOrParam === 'number') {
      url = this.buildUrl(endpoint, bodyOrParam);
      body = undefined;
    }

    if (queryParams) {
      options = {
        ...options,
        params: new HttpParams({ fromObject: queryParams }),
      };
    }

    const response$ =
      method === 'POST'
        ? this.http.post<T>(url, body, options as Object)
        : this.http.patch<T>(url, body, options as Object);

    return this.handleResponse(response$);
  }

  private handleResponse<T>(response$: Observable<T>): Observable<T> {
    return response$.pipe(
      map((response) => {
        if (response === undefined) {
          throw new Error('Response data is undefined.');
        }

        return response;
      }),
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(
          () => new Error('An error occurred while fetching data.')
        );
      })
    );
  }
}
