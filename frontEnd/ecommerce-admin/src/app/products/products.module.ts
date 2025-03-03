import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AllProductsComponent } from './components/all-products/all-products.component';

@NgModule({
  declarations: [AllProductsComponent],
  imports: [CommonModule, SharedModule],
})
export class ProductsModule {}
