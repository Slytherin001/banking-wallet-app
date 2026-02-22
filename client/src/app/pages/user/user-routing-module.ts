import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboard } from './user-dashboard/user-dashboard';
import { TransactionHistory } from './transaction-history/transaction-history';

const routes: Routes = [
  { path: 'dashboard', component: UserDashboard },
  { path: 'transaction-history', component: TransactionHistory },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
