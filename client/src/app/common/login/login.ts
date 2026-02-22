import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthServices } from '../../services/auth/auth-services';
import { Router } from '@angular/router';
import { switchMap, finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username = '';
  password = '';
  showPassword = false;

  // 🔥 Observable loading state
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthServices,
    private router: Router,
    private toast: ToastrService,
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  handleSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading$.next(true);

    this.authService
      .login(this.username, this.password)
      .pipe(
        switchMap(() => this.authService.initializeSession()),
        finalize(() => this.isLoading$.next(false)),
      )
      .subscribe({
        next: (resp: any) => {
          const role = resp?.user?.role?.toLowerCase();

          this.toast.success(`Welcome back, ${resp.user.username}!`, 'Login Successful');

          this.router.navigate([`/${role}/dashboard`]);
        },
        error: (err) => {
          this.toast.error(err?.error?.message || 'Invalid username or password', 'Login Failed');
        },
      });
  }
}
