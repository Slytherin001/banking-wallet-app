import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthServices } from '../../services/auth/auth-services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  role: string | null = null;
  menu: Array<{ label: string; link: string }> = [];

  constructor(private authService: AuthServices) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.role = user.role;
        this.generateMenu();
      }
    });
  }

  generateMenu() {
    if (this.role === 'OWNER') {
      this.menu = [
        { label: 'Dashboard', link: '/owner/dashboard' },
        { label: 'Create Admin', link: '/owner/create-admin' },
        { label: 'Transfer Money', link: '/owner/transfer-money' },
        { label: 'Users', link: '/owner/users' },
        { label: 'Transaction History', link: '/owner/transaction-history' },
      ];
    } else if (this.role === 'ADMIN') {
      this.menu = [
        { label: 'Dashboard', link: '/admin/dashboard' },
        { label: 'Create User', link: '/admin/create-user' },
        { label: 'Transfer Money', link: '/admin/transfer-money' },
        { label: 'Admin Users', link: '/admin/admin-users' },
        { label: 'Transaction History', link: '/admin/transaction-history' },
      ];
    } else if (this.role === 'USER') {
      this.menu = [
        { label: 'Dashboard', link: '/user/dashboard' },
        { label: 'Transaction History', link: '/user/transaction-history' },
      ];
    }
  }
}
