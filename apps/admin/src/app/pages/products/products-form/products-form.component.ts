/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService, Category, Product, ProdutsService } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: [
  ]
})
export class ProductsFormComponent implements OnInit {

  form!: FormGroup ;
  isSubmitted = false;
  editMode = false;
  currentProductId!: string;
  categories: Category[] = [];
  imageDisplay!: any;

  constructor(private route: Router,
    private productsService: ProdutsService,
    private messageService: MessageService,
    private location: Location,
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService
    ) {}

  ngOnInit(): void {
    this._initForm();
    this._categoriesList();
    this._checkEditMode();
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: [''],
      isFeatured: [false],
    });

  }

  private _categoriesList(){
    this.categoriesService.getCategories().subscribe(category => {
      this.categories = category;
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) return ;

    const productFormData = new FormData();
    Object.keys(this.productForm).map((key) => {
     productFormData.append(key, this.productForm[key].value);
    });

    if(this.editMode) {
      this._updateProduct(productFormData);
    } else {
      this._addProduct(productFormData)
    }





    // productFormData.append('name', this.productForm.name.value);
    // productFormData.append('brand', this.productForm.brand.value);
    // productFormData.append('price', this.productForm.price.value);
    // productFormData.append('category', this.productForm.category.value);
    // productFormData.append('countInStock', this.productForm.countInStock.value);
    // productFormData.append('description', this.productForm.description.value);
    // productFormData.append('richDescription', this.productForm.richDescription.value);
    // productFormData.append('image', this.productForm.image.value);
    // productFormData.append('isFeatured', this.productForm.isFeatured.value);

  }

  private _checkEditMode() {
    this.router.params.subscribe(params => {
      if (params.id) {
        this.editMode = true;
        this.currentProductId = params.id;
        this.productsService.getProduct(params.id).subscribe((product: Product) => {
         this.productForm.name.setValue(product.name);
         this.productForm.brand.setValue(product.brand);
         this.productForm.price.setValue(product.price);
         this.productForm.category.setValue(product.category?.id);
         this.productForm.countInStock.setValue(product.countInStock);
         this.productForm.description.setValue(product.description);
         this.productForm.richDescription.setValue(product.richDescription);
         this.productForm.isFeatured.setValue(product.isFeatured);
         this.imageDisplay = product.image;
         this.productForm.image.setValidators([]);
         this.productForm.image.updateValueAndValidity();
        });
      }
    });
  }

  get productForm() {
    return this.form.controls;
  }

  private _addProduct(product: FormData) {
    this.productsService.createProduct(product).subscribe( (product) => {
      this.messageService.add({
        severity:'success',
        summary:'Success',
        detail:`Création du produit!`
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

  private _updateProduct(product: FormData) {
    this.productsService.updateProduct(product, this.currentProductId).subscribe( (product: Product) => {
      this.messageService.add({
        severity:'success',
        summary:'Success',
        detail:`Modification du produit ${product.name} !`
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
    this.route.navigateByUrl('products');
  }

  onImageUpload(event: any) {
   const file = event.target.files[0];
   if(file) {
     this.form.patchValue({image: file});
     this.form.get('image')?.updateValueAndValidity();
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      this.imageDisplay = fileReader.result
    }
   }
  }


}
