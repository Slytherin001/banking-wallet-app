import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { RupeeFormatDirective } from '../../../directives/rupee-format/rupee-format-directive';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { OwnerService } from '../../../services/owner/owner-service';
import { ToastrService } from 'ngx-toastr';
import { TransactionTable } from '../../../common/transaction-table/transaction-table/transaction-table';
import { AuthServices } from '../../../services/auth/auth-services';
import { Router } from '@angular/router';
import { UserTable } from "../../../common/user-table/user-table";

@Component({
  selector: 'app-owner-dashboard',
  imports: [RupeeFormatDirective, FormsModule, CommonModule, TransactionTable, UserTable],
  standalone: true,
  templateUrl: './owner-dashboard.html',
  styleUrl: './owner-dashboard.scss',
})
export class OwnerDashboard {
  @ViewChild('amountInput') amountInput!: ElementRef<HTMLInputElement>;
  currentUser: any;

  constructor(
    private ownerService: OwnerService,
    private authService: AuthServices,
    private toast: ToastrService,
  ) {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user.role;
    });
  }

  handleAddMoney(form: NgForm) {
    console.log('Hello');

    if (form.invalid) {
      this.amountInput.nativeElement.focus();
      return;
    }
    const rawAmount = form.value.amount.replace(/,/g, '');
    const amount = Number(rawAmount);

    this.ownerService.addMoney(amount).subscribe({
      next: (resp: any) => {
        this.toast.success(resp.message, 'Success');
      },
      error: (err) => {
        this.toast.error(err.error.message, 'Error');
      },
    });

    form.resetForm();
  }


}
