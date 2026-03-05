import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { SocketServices } from '../socket/socket-services';

@Injectable({
  providedIn: 'root',
})
export class AuthServices {
  private API_URL = 'http://localhost:5000/api/v1';

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  get currentUser() {
    return this.userSubject.value;
  }

  constructor(
    private http: HttpClient,
    private socketServices: SocketServices,
  ) {
    // 🔥 Auto restore session on app load
    this.initializeSession().subscribe({
      error: () => {
        console.log('No active session');
      },
    });

    // 🔥 Listen for real-time balance updates
    this.socketServices.balance$.subscribe((balance) => {
      if (balance !== null) {
        this.updateBalance(balance);
      }
    });
  }

  login(username: string, password: string) {
    return this.http.post(
      `${this.API_URL}/auth/login`,
      { username, password },
      { withCredentials: true },
    );
  }

  initializeSession() {
    return this.getMe().pipe(
      tap((resp: any) => {
        this.userSubject.next(resp.user);

        // 🔥 Connect socket AFTER user is set
        this.socketServices.connect();
      }),
    );
  }

  getMe() {
    return this.http.get<any>(`${this.API_URL}/auth/me`, { withCredentials: true });
  }

  logout() {
    return this.http.get(`${this.API_URL}/auth/logout`, { withCredentials: true }).pipe(
      tap(() => {
        this.userSubject.next(null);
        this.socketServices.disconnect();
      }),
    );
  }

  private updateBalance(newBalance: number) {
    const currentUser = this.userSubject.value;
    if (!currentUser) return;

    this.userSubject.next({
      ...currentUser,
      balance: newBalance,
    });
  }
}
