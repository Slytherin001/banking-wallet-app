import { Component } from '@angular/core';
import { TransactionTable } from "../../../common/transaction-table/transaction-table/transaction-table";
import { UserTable } from "../../../common/user-table/user-table";

@Component({
  selector: 'app-admin-dashboard',
  imports: [TransactionTable, UserTable],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  
}
