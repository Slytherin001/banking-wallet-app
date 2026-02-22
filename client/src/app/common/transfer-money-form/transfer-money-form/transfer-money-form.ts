import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RupeeFormatDirective } from '../../../directives/rupee-format/rupee-format-directive';
import { OwnerService } from '../../../services/owner/owner-service';
import { ToastrService } from 'ngx-toastr';
import { AuthServices } from '../../../services/auth/auth-services';
import { AdminService } from '../../../services/admin/admin-service';
import { UserService } from '../../../services/user/user-service';

@Component({
  selector: 'app-transfer-money-form',
  imports: [CommonModule, FormsModule, RupeeFormatDirective],
  templateUrl: './transfer-money-form.html',
  styleUrl: './transfer-money-form.scss',
})
export class TransferMoneyForm {
  isDropdown = false;
  selectedOptions: string | null = 'Select Beneficary';
  selectedId: string | null = null;
  currentUser: any;
  beneficaries: any[] = [];

  constructor(
    private ownerService: OwnerService,
    private authService: AuthServices,
    private adminService: AdminService,
    private userService: UserService,
    private toast: ToastrService,
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user.role;
    });

    if (this.currentUser === 'OWNER') {
      this.ownerService.getMyAdmin().subscribe((resp: any) => {
        this.beneficaries = resp.admin;
      });
    } else if (this.currentUser === 'ADMIN') {
      this.adminService.getMyBeneficary().subscribe((resp: any) => {
        console.log(resp);
        this.beneficaries = resp.beneficary;
      });
    }
  }

  toggleDropdown() {
    this.isDropdown = !this.isDropdown;
  }

  handleSelectOption(option: any) {
    this.selectedOptions = option.username;
    this.selectedId = option._id;
  }

  handleTransferMoney(form: NgForm) {
    const rawAmount = form.value.amount.replace(/,/g, '');
    const amount = Number(rawAmount);

    if (form.invalid || this.selectedOptions === 'Select Beneficary') {
      return;
    }

    if (this.currentUser === 'OWNER') {
      this.ownerService.transferMoney(this.selectedId, amount).subscribe({
        next: (resp: any) => {
          this.ownerService.transactionHistory().subscribe();
          this.adminService.getTransactionHistory().subscribe();
          this.toast.success(resp.message, 'Success');
        },
        error: (err) => {
          this.toast.error(err.error.message, 'Error');
        },
      });
    } else if (this.currentUser === 'ADMIN') {
      this.adminService.creditMoney(this.selectedId, amount).subscribe({
        next: (resp: any) => {
          this.adminService.getTransactionHistory().subscribe();
          this.userService.getTransaction().subscribe();
          this.toast.success(resp.message, 'Success');
        },
        error: (err: any) => {
          this.toast.error(err.error.message, 'Error');
        },
      });
    }

    form.resetForm();
    this.selectedOptions = 'Select Beneficary';
  }
}
