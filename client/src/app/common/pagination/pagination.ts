import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthServices } from '../../services/auth/auth-services';
import { Router } from '@angular/router';

interface PaginationInterface {
  currentPage: number;
  totalPages: number;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  currentUser: any;
  @Input() pagination!: PaginationInterface | null;
  @Output() pageChange = new EventEmitter<number>();

  pages: (number | string)[] = [];

  constructor(
    private authService: AuthServices,
    private router: Router,
  ) {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user.role;
    });
  }

  ngOnChanges() {
    if (this.pagination) {
      this.pages = this.generatePages(this.pagination.currentPage, this.pagination.totalPages);
    }
  }

  generatePages(current: number, total: number): (number | string)[] {
    const pages: (number | string)[] = [];
    const delta = 2;

    const rangeStart = Math.max(2, current - delta);
    const rangeEnd = Math.min(total - 1, current + delta);

    pages.push(1);

    if (rangeStart > 2) pages.push('...');

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < total - 1) pages.push('...');

    if (total > 1) pages.push(total);

    return pages;
  }

  changePage(page: number | string) {
    if (typeof page !== 'number') return;
    this.pageChange.emit(page);
  }
  first() {
    if (this.pagination && this.pagination.currentPage !== 1) {
      this.pageChange.emit(1);
    }
  }

  prev() {
    if (this.pagination && this.pagination.currentPage > 1) {
      this.pageChange.emit(this.pagination.currentPage - 1);
    }
  }

  next() {
    if (this.pagination && this.pagination.currentPage < this.pagination.totalPages) {
      this.pageChange.emit(this.pagination.currentPage + 1);
    }
  }

  last() {
    if (this.pagination && this.pagination.currentPage !== this.pagination.totalPages) {
      this.pageChange.emit(this.pagination.totalPages);
    }
  }
}
