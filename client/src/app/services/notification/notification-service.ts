import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private API_URL = 'http://localhost:5000/api/v1';

  private notificationSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllNotification() {
    return this.http
      .get<any>(`${this.API_URL}/notification`, {
        withCredentials: true,
      })
      .pipe(
        tap((resp: any) => {
          this.notificationSubject.next(resp.notifications);
        }),
      );
  }

  markAsRead(id: string) {
    return this.http.patch(
      `${this.API_URL}/notification/mark-as-read/${id}`,
      {},
      { withCredentials: true },
    );
  }

  addNotification(notification: any) {
    const current = this.notificationSubject.value;
    this.notificationSubject.next([notification, ...current]);
  }

  updateNotificationAsRead(id: string) {
    const current = this.notificationSubject.value;

    const updated = current.map((notif) => (notif._id === id ? { ...notif, read: true } : notif));

    this.notificationSubject.next(updated);
  }

  deleteNotification(id: string) {
    return this.http.delete(`${this.API_URL}/notification/${id}`, {
      withCredentials: true,
    });
  }

  removeNotificationFromState(id: string) {
    const current = this.notificationSubject.value;
    const updated = current.filter((n) => n._id !== id);
    this.notificationSubject.next(updated);
  }

  bulkDelete(ids: string[]) {
    return this.http.delete<any>(`${this.API_URL}/notification/bulk-delete`, {
      body: { ids },
      withCredentials: true,
    });
  }
}
