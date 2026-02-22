import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormattedDatePipe } from '../../shared/format-date/formatted-date-pipe';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../services/notification/notification-service';

@Component({
  selector: 'app-notification',
  imports: [CommonModule, FormattedDatePipe],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class Notification {
  notifications$!: Observable<any>;
  unreadCount$!: Observable<number>;
  isNotification: boolean = false;
  selectedNotifications = new Set<string>();
  isAllSelected: boolean = false;

  constructor(
    private router: Router,
    private elRef: ElementRef,
    private notificationService: NotificationService,
    private toast: ToastrService,
  ) {
    this.notifications$ = this.notificationService.notifications$;
    this.unreadCount$ = this.notifications$.pipe(
      map((notifications) => notifications.filter((n: any) => !n.read).length),
    );
  }

  ngOnInit() {
    this.notificationService.getAllNotification().subscribe();
  }

  toggleNotification() {
    this.isNotification = !this.isNotification;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isNotification = false;
    }
  }

  // Close notification dropdown on window scroll
  @HostListener('window:scroll')
  onWindowScroll() {
    if (this.isNotification) {
      this.isNotification = false;
    }
  }

  markAsRead(notification: any) {
    if (notification.read) return;
    this.notificationService.updateNotificationAsRead(notification._id);
    this.notificationService.markAsRead(notification._id).subscribe();
  }

  deleteNotification(notification: any, event: Event) {
    event.stopPropagation();
    this.notificationService.deleteNotification(notification).subscribe(() => {
      this.notificationService.removeNotificationFromState(notification);
    });
  }

  toggleSelectAllNotifications(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.isAllSelected = checked;
    this.notifications$
      .subscribe((notifications) => {
        if (checked) {
          notifications.forEach((n: any) => this.selectedNotifications.add(n._id));
        } else {
          this.selectedNotifications.clear();
        }
      })
      .unsubscribe();
  }

  onCheckboxChange(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedNotifications.add(id);
    } else {
      this.selectedNotifications.delete(id);
    }

    this.updateSelectAllState();
  }

  updateSelectAllState() {
    this.notifications$
      .subscribe((notifications) => {
        this.isAllSelected =
          notifications.length > 0 &&
          notifications.every((n: any) => this.selectedNotifications.has(n._id));
      })
      .unsubscribe();
  }

  deleteSelected() {
    const ids = Array.from(this.selectedNotifications);
    if (ids.length === 0) return;

    this.notificationService.bulkDelete(ids).subscribe({
      next: (resp: any) => {
        this.selectedNotifications.clear();
        this.isAllSelected = false;
        this.toast.success(resp.message, 'Success');
        this.notificationService.getAllNotification().subscribe();
      },
      error: (err) => {
        this.toast.error(err.error.message, 'Error');
      },
    });
  }
}
