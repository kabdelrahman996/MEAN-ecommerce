import { Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-all-products',
  standalone: false,

  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.css',
})
export class AllProductsComponent {
  products: any[] = [];
  categories: any[] = [];
  cartProducts: any[] = [];
  isLoading: boolean = false;

  constructor(private service: ProductsService) {}

  ngOnInit() {
    this.getAllProducts();
    this.getAllCategories();
  }

  getAllProducts() {
    this.isLoading = true;
    this.service.getAllProducts().subscribe(
      (res: any) => {
        if (res.status == 'success') {
          this.products = res.data;
          this.isLoading = false;
        } else {
          console.error('Failed To Fetch Data, ', res.message);
          alert('Failed To Fetch Data');
          this.isLoading = false;
        }
      },
      (err) => {
        console.log('Error: ', err.error.message);
        alert('Error');
        this.isLoading = false;
      }
    );
  }

  getAllCategories() {
    this.service.getAllCategories().subscribe(
      (res: any) => {
        if (res.status == 'success') {
          this.categories = res.data;
        } else {
          console.log('Failed To Fetch Data, ', res.message);
        }
      },
      (err) => {
        console.log('Error: ', err.error.message);
      }
    );
  }

  filterCategory(event: any) {
    let value = event.target.value;
    value === 'all' ? this.getAllProducts() : this.getFilteredProducts(value);
  }

  getFilteredProducts(categoryId: String) {
    this.isLoading = true;
    this.service.getProductsByCategory(categoryId).subscribe(
      (res: any) => {
        if (res.status == 'success') {
          this.products = res.data;
          this.isLoading = false;
        } else {
          console.log('Failed To Fetch Data, ', res.message);
          this.isLoading = false;
        }
      },
      (err) => {
        console.log('Error: ', err.error.message);
        this.isLoading = false;
      }
    );
  }

  addToCart(product: any) {
    if ('cart' in localStorage) {
      this.cartProducts = JSON.parse(localStorage.getItem('cart')!);
      let isExist = this.cartProducts.find((item: any) => {
        return item.item.id === product.item.id;
      });
      if (isExist) {
        alert('product already exist in tha cart');
      } else {
        this.cartProducts.push(product);
        localStorage.setItem('cart', JSON.stringify(this.cartProducts));
      }
    } else {
      this.cartProducts.push(product);
      localStorage.setItem('cart', JSON.stringify(this.cartProducts));
    }
  }
}
