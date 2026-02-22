import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { AuthServices } from '../../services/auth/auth-services';
import { OwnerService } from '../../services/owner/owner-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin/admin-service';

@Component({
  selector: 'app-create-user-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user-form.html',
  styleUrl: './create-user-form.scss',
})
export class CreateUserForm {
  username = '';
  password = '';
  showPassword = false;
  isLoading$ = new BehaviorSubject<boolean>(false);
  currentUser: any;

  constructor(
    private authService: AuthServices,
    private ownerService: OwnerService,
    private adminService: AdminService,
    private toast: ToastrService,
    private router: Router,
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user.role;
    });
  }

  handleCreateUser(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading$.next(true);

    if (this.currentUser === 'OWNER') {
      this.ownerService
        .createAdmin(this.username, this.password)
        .pipe(
          tap(() => form.reset()),
          finalize(() => {
            this.isLoading$.next(false);
          }),
        )
        .subscribe({
          next: (resp: any) => {
            this.toast.success(resp.message);
            this.router.navigate(['/owner/users']);
          },
          error: (err) => {
            this.isLoading$.next(false);
            this.toast.error(err.error.message);
          },
        });
    } else if (this.currentUser === 'ADMIN') {
      this.adminService
        .createUser(this.username, this.password)
        .pipe(
          tap(() => form.resetForm()),
          finalize(() => {
            this.isLoading$.next(false);
          }),
        )
        .subscribe({
          next: (resp: any) => {
            this.toast.success(resp.message);
          },
          error: (err) => {
            this.isLoading$.next(false);
            this.toast.error(err.error.message);
          },
        });
    }
  }
}
