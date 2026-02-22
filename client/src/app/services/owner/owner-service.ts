import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  private API_URL = 'http://localhost:5000/api/v1';

  private allUserSubject = new BehaviorSubject<any>(null);
  allUsers$ = this.allUserSubject.asObservable();

  private allTransactionSubject = new BehaviorSubject<any>(null);
  allTransaction$ = this.allTransactionSubject.asObservable();

  private transactionLoadingSubject = new BehaviorSubject<boolean>(false);
  transactionLoading$ = this.transactionLoadingSubject.asObservable();

  private paginationSubject = new BehaviorSubject<any>(null);
  pagination$ = this.paginationSubject.asObservable();

  private transactionPaginationSubject = new BehaviorSubject<any>(null);
  transactionPagination$ = this.transactionPaginationSubject.asObservable();

  constructor(private http: HttpClient) {}

  createAdmin(username: string, password: string) {
    return this.http.post(
      `${this.API_URL}/owner/create-admin`,
      { username, password },
      {
        withCredentials: true,
      },
    );
  }

  allUsers(page: number = 1, limit: number = 10) {
    return this.http
      .get(`${this.API_URL}/owner/all-users?page=${page}&limit=${limit}`, {
        withCredentials: true,
      })
      .pipe(
        tap((resp: any) => {
          this.allUserSubject.next(resp.users);
          this.paginationSubject.next(resp.pagination);
        }),
      );
  }

  getMyAdmin() {
    return this.http.get<any>(`${this.API_URL}/owner/owner-admin`, {
      withCredentials: true,
    });
  }

  transferMoney(adminId: any, amount: number) {
    return this.http.post<any>(
      `${this.API_URL}/owner/transfer-money`,
      { adminId, amount },
      {
        withCredentials: true,
      },
    );
  }

  transactionHistory(page: number = 1, limit: number = 10) {
    return this.http
      .get<any>(`${this.API_URL}/owner/transaction?page=${page}&limit=${limit}`, {
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

  addMoney(amount: number) {
    return this.http.post<any>(
      `${this.API_URL}/owner/add-balance`,
      { amount },
      {
        withCredentials: true,
      },
    );
  }
}
