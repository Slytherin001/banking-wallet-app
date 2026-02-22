import { Component } from '@angular/core';
import { TransferMoneyForm } from "../../../common/transfer-money-form/transfer-money-form/transfer-money-form";

@Component({
  selector: 'app-transfer-money',
  imports: [TransferMoneyForm],
  templateUrl: './transfer-money.html',
  styleUrl: './transfer-money.scss',
})
export class TransferMoney {

}
