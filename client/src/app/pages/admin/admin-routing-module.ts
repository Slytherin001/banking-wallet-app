import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { TransferMoney } from './transfer-money/transfer-money';
import { TransactionHistory } from './transaction-history/transaction-history';
import { CreateUserForm } from '../../common/create-user-form/create-user-form';
import { AdminUsers } from './admin-users/admin-users/admin-users';

const routes: Routes = [
  { path: 'dashboard', component: AdminDashboard },
  { path: 'create-user', component: CreateUserForm },
  { path: 'transfer-money', component: TransferMoney },
  { path: 'transaction-history', component: TransactionHistory },
  { path: 'admin-users', component: AdminUsers },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
