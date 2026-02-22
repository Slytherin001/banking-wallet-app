import { Component } from '@angular/core';
import { TransactionTable } from "../../../common/transaction-table/transaction-table/transaction-table";

@Component({
  selector: 'app-transaction-history',
  imports: [TransactionTable],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.scss',
})
export class TransactionHistory {

}
