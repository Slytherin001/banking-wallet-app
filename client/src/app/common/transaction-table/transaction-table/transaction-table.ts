import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { OwnerService } from '../../../services/owner/owner-service';
import { CommonModule } from '@angular/common';
import { FormattedDatePipe } from '../../../shared/format-date/formatted-date-pipe';
import { RupeeFormatPipe } from '../../../shared/rupees/rupee-format-pipe';
import { Pagination } from '../../pagination/pagination';
import { AuthServices } from '../../../services/auth/auth-services';
import { AdminService } from '../../../services/admin/admin-service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user-service';

@Component({
  selector: 'app-transaction-table',
  imports: [CommonModule, FormattedDatePipe, RupeeFormatPipe, Pagination],
  templateUrl: './transaction-table.html',
  styleUrl: './transaction-table.scss',
})
export class TransactionTable {
  @Input() limit = 10;
  @Input() showPagination = true;
  @Input() showViewAll = false;

  allTransactions$!: Observable<any[]>;
  isLoading$!: Observable<boolean>;
  pagination$!: Observable<any>;

  currentUser: any;

  currentPage = 1;

  constructor(
    private ownerService: OwnerService,
    private authService: AuthServices,
    private adminService: AdminService,
    private userService: UserService,
    private router: Router,
  ) {
    this.authService.user$.subscribe((user) => {
      if (!user) return;

      this.currentUser = user.role;

      if (this.currentUser === 'OWNER') {
        this.loadOwnerTransactions();
      } else if (this.currentUser === 'ADMIN') {
        this.loadAdminTransactions();
      } else if (this.currentUser === 'USER') {
        this.loadUserTransaction();
      }
    });
  }

  ngOnInit(): void {
    if (this.currentUser === 'OWNER') {
      this.loadOwnerTransactions();
    } else if (this.currentUser === 'ADMIN') {
      this.loadAdminTransactions();
    } else if (this.currentUser === 'USER') {
      this.loadUserTransaction();
    }
  }

  loadOwnerTransactions(): void {
    this.ownerService.transactionHistory(this.currentPage, this.limit).subscribe();
    this.allTransactions$ = this.ownerService.allTransaction$;
    this.isLoading$ = this.ownerService.transactionLoading$;
    this.pagination$ = this.ownerService.transactionPagination$;
  }

  loadAdminTransactions(): void {
    this.adminService.getTransactionHistory(this.currentPage, this.limit).subscribe();
    this.allTransactions$ = this.adminService.allTransaction$;
    this.pagination$ = this.adminService.transactionPagination$;
  }

  loadUserTransaction(): void {
    this.userService.getTransaction(this.currentPage, this.limit).subscribe();
    this.allTransactions$ = this.userService.allTransaction$;
    this.pagination$ = this.userService.transactionPagination$;
  }

  changePage(page: number): void {
    this.currentPage = page;
    if (this.currentUser === 'OWNER') {
      this.loadOwnerTransactions();
    } else if (this.currentUser === 'ADMIN') {
      this.loadAdminTransactions();
    } else if (this.currentUser === 'USER') {
      this.loadUserTransaction();
    }
  }
  goToFullHistory(): void {
    if (this.currentUser === 'OWNER') {
      this.router.navigate(['/owner/transaction-history']);
    } else if (this.currentUser === 'ADMIN') {
      this.router.navigate(['/admin/transaction-history']);
    } else if (this.currentUser === 'USER') {
      this.router.navigate(['/user/transaction-history']);
    }
  }
}
