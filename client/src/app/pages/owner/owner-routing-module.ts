import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnerDashboard } from './owner-dashboard/owner-dashboard';
import { AllUsers } from './all-users/all-users';
import { TransactionHistory } from './transaction-history/transaction-history';
import { TransferMoney } from './transfer-money/transfer-money';
import { CreateUserForm } from '../../common/create-user-form/create-user-form';

const routes: Routes = [
  { path: 'dashboard', component: OwnerDashboard },
  { path: 'create-admin', component: CreateUserForm },
  { path: 'transfer-money', component: TransferMoney },
  { path: 'users', component: AllUsers },
  { path: 'transaction-history', component: TransactionHistory },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerRoutingModule {}
