import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CartsComponent } from './components/carts/carts.component';

@NgModule({
  declarations: [
    CartsComponent
  ],
  imports: [CommonModule, SharedModule],
})
export class CartsModule {}
