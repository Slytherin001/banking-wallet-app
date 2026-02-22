import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = 'http://localhost:5000/api/v1';

  private allTransactionSubject = new BehaviorSubject<any>(null);
  allTransaction$ = this.allTransactionSubject.asObservable();

  private transactionPaginationSubject = new BehaviorSubject<any>(null);
  transactionPagination$ = this.transactionPaginationSubject.asObservable();

  private transactionLoadingSubject = new BehaviorSubject<boolean>(false);
  transactionLoading$ = this.transactionLoadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  getTransaction(page: number = 1, limit: number = 10) {
    return this.http
      .get<any>(`${this.API_URL}/user/user-transaction?page=${page}&limit=${limit}`, {
        withCredentials: true,
      })
      .pipe(
        tap((resp: any) => {
          this.allTransactionSubject.next(resp.transactions);
          this.transactionPaginationSubject.next(resp.pagination);
        }),
        finalize(() => {
          this.transactionLoadingSubject.next(false);
        }),
      );
  }
}
