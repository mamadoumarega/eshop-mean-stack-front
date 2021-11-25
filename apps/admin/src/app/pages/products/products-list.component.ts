/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProdutsService } from '@bluebits/products';
import { ConfirmationService, MessageService } from 'primeng/api';



@Component({
  selector: 'admin-products',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];

  constructor(private productsService: ProdutsService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this._getProducts();
  }

  private _getProducts() {
    this.productsService.getProducts().subscribe((product) => {
      this.products = product;
    });
  }

  deleteProduct(productId: string) {
    this.confirmationService.confirm({
      message: 'Voulez-vous supprimer?',
      header: 'Suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productsService.deleteProduct(productId).subscribe(response => {
          this._getProducts();
          this.messageService.add({
            severity:'success',
            summary:'Success',
            detail:'Suppression éffectuée!'
          });
        },
        (error) => {
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

  UpdateProduct(productId: string) {
    this.router.navigateByUrl(`products/form/${productId}`)
  }

}
