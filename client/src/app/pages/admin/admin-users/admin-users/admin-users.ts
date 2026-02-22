import { Component } from '@angular/core';
import { UserTable } from '../../../../common/user-table/user-table';

@Component({
  selector: 'app-admin-users',
  imports: [UserTable],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
})
export class AdminUsers {

}
