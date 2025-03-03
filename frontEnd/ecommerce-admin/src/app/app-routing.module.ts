import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { CartsComponent } from './carts/components/carts/carts.component';
import { AllProductsComponent } from './products/components/all-products/all-products.component';

const routes: Routes = [
  { path: '', component: CartsComponent },
  { path: 'products', component: AllProductsComponent },
  { path: 'carts', component: CartsComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'carts', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
