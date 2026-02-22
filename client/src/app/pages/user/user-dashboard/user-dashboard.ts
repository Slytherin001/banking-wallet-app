import { Component } from '@angular/core';
import { TransactionTable } from '../../../common/transaction-table/transaction-table/transaction-table';

@Component({
  selector: 'app-user-dashboard',
  imports: [TransactionTable],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})
export class UserDashboard {
  
}
