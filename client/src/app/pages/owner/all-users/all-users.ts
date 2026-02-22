import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../../../services/owner/owner-service';
import { UserTable } from '../../../common/user-table/user-table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, UserTable],
  templateUrl: './all-users.html',
  styleUrl: './all-users.scss',
})
export class AllUsers {}
