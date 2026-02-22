import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserType } from '../../model/user/user-type';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private API_URL = 'http://localhost:5000/api/v1';

  private adminUserSubjet = new BehaviorSubject<any>(null);
  adminUsers$ = this.adminUserSubjet.asObservable();

  private allTransactionSubject = new BehaviorSubject<any>(null);
  allTransaction$ = this.allTransactionSubject.asObservable();

  private transactionPaginationSubject = new BehaviorSubject<any>(null);
  transactionPagination$ = this.transactionPaginationSubject.asObservable();

  private paginationSubject = new BehaviorSubject<any>(null);
  pagination$ = this.paginationSubject.asObservable();

  constructor(private http: HttpClient) {}

  allAdminUsers(page: number = 1, limit: number = 10) {
    return this.http
      .get(`${this.API_URL}/admin/get-my-users?page=${page}&limit=${limit}`, {
        withCredentials: true,
      })
      .pipe(
        tap((resp: any) => {
          this.adminUserSubjet.next(resp.users);
          this.paginationSubject.next(resp.pagination);
        }),
      );
  }

  createUser(username: string, password: string) {
    return this.http.post<UserType>(
      `${this.API_URL}/admin/create-user-by-admin`,
      {
        username,
        password,
      },
      { withCredentials: true },
    );
  }

  getMyBeneficary() {
    return this.http.get(`${this.API_URL}/admin/get-beneficary`, {
      withCredentials: true,
    });
  }

  creditMoney(userId: any, amount: number) {
    return this.http.post<any>(
      `${this.API_URL}/admin/credit-money`,
      {
        userId,
        amount,
      },
      { withCredentials: true },
    );
  }

  getTransactionHistory(page: number = 1, limit: number = 10) {
    return this.http
      .get<any>(`${this.API_URL}/admin/get-admin-transaction?page=${page}&limit=${limit}`, {
        withCredentials: true,
      })
      .pipe(
        tap((resp: any) => {
          this.allTransactionSubject.next(resp.transactions);
          this.transactionPaginationSubject.next(resp.pagination);
        }),
      );
  }
}
