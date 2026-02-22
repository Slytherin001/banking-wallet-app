import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthServices } from '../../services/auth/auth-services';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Notification } from '../../common/notification/notification';
import { ToastrService } from 'ngx-toastr';
import { RupeeFormatPipe } from '../../shared/rupees/rupee-format-pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, Notification, RupeeFormatPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  user$!: Observable<any>;

  constructor(
    private authService: AuthServices,
    private router: Router,
    private toast: ToastrService,
  ) {
    this.user$ = this.authService.user$;
  }

  logout() {
    this.authService.logout().subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.router.navigate(['/login']);
          this.toast.success(resp.message, 'Logout');
        }
      },
      error: (err) => {
        this.toast.error(err.error.message || 'Logout Failed', 'Error');
      },
    });
  }
}
