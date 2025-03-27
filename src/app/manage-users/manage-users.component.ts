import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../database/models/user.model';
import * as UserActions from './store/users.actions';
import { 
  selectAllUsers, 
  selectUsersLoading, 
  selectUsersError, 
  selectUsersSuccessMessage 
} from './store/users.selectors';
import { CommonModule, NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-manage-users',
  imports: [NgIf, NgFor, CommonModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent implements OnInit {
  users$: Observable<User[]> = this.store.select(selectAllUsers);
  loading$: Observable<boolean> = this.store.select(selectUsersLoading);
  errorMessage$: Observable<string | null> = this.store.select(selectUsersError);
  successMessage$: Observable<string | null> = this.store.select(selectUsersSuccessMessage);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(UserActions.loadUsers());
  }

  deleteUser(userId: string) {
    this.store.dispatch(UserActions.deleteUser({ userId }));
  }

  changeRole(userId: string, role: string) {
    this.store.dispatch(UserActions.assignRole({ userId, roles: [role] }));
  }
}
