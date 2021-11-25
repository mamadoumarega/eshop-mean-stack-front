/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UsersService } from '@bluebits/products';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: [
  ]
})
export class UsersListComponent implements OnInit {

  users: User[] = [];

  constructor(private usersService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._getUsers();
  }

  deleteUser(userId: string) {
    this.confirmationService.confirm({
      message: 'Voulez-vous supprimer?',
      header: 'Suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUser(userId).subscribe(response => {
          this._getUsers();
          this.messageService.add({
            severity:'success',
            summary:'Success',
            detail:'Suppression éffectuée!'
          });
        },
        () => {
          this.messageService.add({
            severity:'error',
            summary:'Error',
            detail:'Erreur lors de la suppression'
          });
        });
      },
      reject: (type: any) => {}
    });

  }

  updateUser(userId: string) {
    this.router.navigateByUrl(`users/form/${userId}`);
  }

  getCountryName(countryKey: string) {
    return this.usersService.getCountry(countryKey);
  }

  private _getUsers() {
    this.usersService.getUsers().subscribe(user => {
      this.users = user;
    });
  }



}
