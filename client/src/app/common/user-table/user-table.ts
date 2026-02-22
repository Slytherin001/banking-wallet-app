import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OwnerService } from '../../services/owner/owner-service';
import { FormattedDatePipe } from '../../shared/format-date/formatted-date-pipe';
import { Observable, map, startWith } from 'rxjs';
import { RupeeFormatPipe } from '../../shared/rupees/rupee-format-pipe';
import { Pagination } from '../pagination/pagination';
import { AuthServices } from '../../services/auth/auth-services';
import { AdminService } from '../../services/admin/admin-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, FormattedDatePipe, RupeeFormatPipe, Pagination],
  templateUrl: './user-table.html',
  styleUrl: './user-table.scss',
})
export class UserTable {
  @Input() limit = 10;
  @Input() showPagination = true;
  @Input() showViewAll = false;
  allData$!: Observable<any[]>;
  allAdminData$!: Observable<any[]>;
  isLoading$!: Observable<boolean>;
  pagination$!: Observable<any>;
  currentUser: any;

  currentPage = 1;

  constructor(
    private ownerService: OwnerService,
    private authService: AuthServices,
    private adminService: AdminService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.currentUser = user.role;
      }
    });
    if (this.currentUser === 'OWNER') {
      this.loadUsers();
    } else if (this.currentUser === 'ADMIN') {
      this.loadAdminUsers();
    }
  }

  loadUsers(): void {
    this.ownerService.allUsers(this.currentPage, this.limit).subscribe();
    this.allData$ = this.ownerService.allUsers$;
    this.pagination$ = this.ownerService.pagination$;
    this.isLoading$ = this.ownerService.allUsers$.pipe(
      map(() => false),
      startWith(true),
    );
  }

  loadAdminUsers(): void {
    this.adminService.allAdminUsers(this.currentPage, this.limit).subscribe();
    this.allAdminData$ = this.adminService.adminUsers$;
    this.pagination$ = this.adminService.pagination$;
    this.isLoading$ = this.adminService.adminUsers$.pipe(
      map(() => false),
      startWith(true),
    );
  }

  changePage(page: number): void {
    this.currentPage = page;

    if (this.currentUser === 'OWNER') {
      this.loadUsers();
    } else if (this.currentUser === 'ADMIN') {
      this.loadAdminUsers();
    }
  }

  goToFullUser(): void {
    if (this.currentUser === 'OWNER') {
      this.router.navigate(['/owner/users']);
    } else if (this.currentUser === 'ADMIN') {
      this.router.navigate(['/admin/admin-users']);
    }
  }
}
