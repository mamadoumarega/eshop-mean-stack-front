/* eslint-disable @typescript-eslint/no-var-requires */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { User, UsersService } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';


@Component({
  selector: 'admin-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: []
})
export class UsersFormComponent implements OnInit {

  form!: FormGroup ;
  isSubmitted = false;
  editMode = false;
  currentUserId!: string;
  countries: any = [];

  constructor(private formBuilder: FormBuilder,
    private usersService: UsersService,
    private messageService: MessageService,
    private location: Location,
    private router: ActivatedRoute,
    private route: Router
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._getCountries();
    this._checkEditMode();
  }
  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', Validators.required],
      phone: ['', Validators.required],
      isAdmin: [false],
      street: [''],
      apartment: [''],
      zip: [''],
      country: [''],
      city: [''],
    });
  }


  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return ;
    }
    const user: User = {
      id: this.currentUserId,
      name: this.userForm.name.value,
      email: this.userForm.email.value,
      passwordHash: this.userForm.passwordHash.value,
      phone: this.userForm.phone.value,
      isAdmin: this.userForm.isAdmin.value,
      street: this.userForm.street.value,
      apartment: this.userForm.apartment.value,
      zip: this.userForm.zip.value,
      country: this.userForm.country.value,
      city: this.userForm.city.value,
    }
    if ( this.editMode) {
      this._updateUser(user);
    } else {
      this._addUser(user);
    }


  }

  private _checkEditMode() {
    this.router.params.subscribe(params => {
      if (params.id) {
        this.editMode = true;
        this.currentUserId = params.id;
        this.usersService.getUser(params.id).subscribe((user: User) =>{
         this.userForm.name.setValue(user.name);
         this.userForm.email.setValue(user.email);
         this.userForm.isAdmin.setValue(user.isAdmin);
         this.userForm.street.setValue(user.street);
         this.userForm.apartment.setValue(user.apartment);
         this.userForm.zip.setValue(user.zip);
         this.userForm.city.setValue(user.city);
         this.userForm.country.setValue(user.country);
         this.userForm.phone.setValue(user.phone);
         this.userForm.passwordHash.setValidators([]);
         this.userForm.passwordHash.updateValueAndValidity();
        });
      }
    });
  }

  get userForm() {
    return this.form.controls;
  }

  private _addUser(user: User) {
    this.usersService.createUser(user).subscribe( (user: User) => {
      this.messageService.add({
        severity:'success',
        summary:'Success',
        detail:`Création du catégorie ${user.name}!`
      });
      timer(2000).toPromise().then( done => {
        this.location.back()
      })
    },
    () => {
      this.messageService.add({
        severity:'error',
        summary:'Error',
        detail:'Erreur lors de la création'
      });
    });
  }

  private _updateUser(user: User) {
    this.usersService.updateUser(user).subscribe( (user: User) => {
      this.messageService.add({
        severity:'success',
        summary:'Success',
        detail:`Modification de la user ${user.name} !`
      });
      timer(2000).toPromise().then( () => {
        this.location.back()
      })
    },
    () => {
      this.messageService.add({
        severity:'error',
        summary:'Error',
        detail:'Erreur lors de la modification'
      });
    });
  }

  goBack() {
    this.route.navigateByUrl('users');
  }


}
