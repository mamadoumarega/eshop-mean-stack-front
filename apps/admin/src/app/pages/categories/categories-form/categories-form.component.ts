/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Category } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit {

  form!: FormGroup ;
  isSubmitted = false;
  editMode = false;
  currentCategoryId!: string;

  constructor(private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private location: Location,
    private router: ActivatedRoute,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['#fff']
    });

    this._checkEditMode();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return ;
    }
    const category: Category = {
      id: this.currentCategoryId,
      name: this.categoryForm.name.value,
      icon: this.categoryForm.icon.value,
      color: this.categoryForm.color.value
    }
    if ( this.editMode) {
      this._updateCategory(category);
    } else {
      this._addCategory(category);
    }


  }

  private _checkEditMode() {
    this.router.params.subscribe(params => {
      if (params.id) {
        this.editMode = true;
        this.currentCategoryId = params.id;
        this.categoriesService.getCategory(params.id).subscribe((category: Category) =>{
         this.categoryForm.name.setValue(category.name);
         this.categoryForm.icon.setValue(category.icon);
         this.categoryForm.color.setValue(category.color);
        })
      }
    });
  }

  get categoryForm() {
    return this.form.controls;
  }

  private _addCategory(category: Category) {
    this.categoriesService.createCategory(category).subscribe( (category: Category) => {
      this.messageService.add({
        severity:'success',
        summary:'Success',
        detail:`Création du catégorie ${category.name}!`
      });
      timer(2000).toPromise().then( done => {
        this.location.back()
      })
    },
    (error) => {
      this.messageService.add({
        severity:'error',
        summary:'Error',
        detail:'Erreur lors de la création'
      });
    });
  }

  private _updateCategory(category: Category) {
    this.categoriesService.updateCategory(category).subscribe( (category: Category) => {
      this.messageService.add({
        severity:'success',
        summary:'Success',
        detail:`Modification de la category ${category.name} !`
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
    this.route.navigateByUrl('categories');
  }

}
