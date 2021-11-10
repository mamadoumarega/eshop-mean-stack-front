import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { ProductListComponent } from './pages/product-list/product-list.component';
import { HomePageComponent } from "./pages/home-page/home-page.component";
import {RouterModule, Routes} from "@angular/router";
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import{ UiModule } from '@bluebits/ui';
import {AccordionModule} from 'primeng/accordion';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'products', component: ProductListComponent }
];


@NgModule({
  declarations: [AppComponent, HomePageComponent, ProductListComponent, HeaderComponent, FooterComponent],
  imports: [BrowserModule,BrowserAnimationsModule, RouterModule.forRoot(routes), UiModule, AccordionModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
