import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-details',
  standalone: false,

  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  apiUrl = environment.apiUrl;
  productId: any;
  product: any;
  cartProducts: any[] = [];
  quantity: number = 1;
  mainImage: string = '';
  warningAlert: boolean = false;
  successAlert: boolean = false;
  warningMessage: string = '';

  constructor(private route: ActivatedRoute, private service: ProductsService) {
    this.productId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.fetchProductDetails();
  }

  fetchProductDetails() {
    this.service.getSingleProduct(this.productId).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.product = res.data;
          this.mainImage = this.product.image;
        } else {
          console.error('Failed to fetch product details:', res.message);
        }
      },
      (err) => {
        console.error(
          'An error occurred while fetching product details:',
          err.error.message
        );
      }
    );
  }

  // Change the main image when a thumbnail is clicked
  changeMainImage(image: string) {
    this.mainImage = image;
  }

  // Add to cart
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

  validateQuantity() {
    if (this.quantity < 1) {
      this.warningAlert = true;
      this.warningMessage = 'Quntity Must be greater than 0';
      setTimeout(() => {
        this.warningAlert = false;
      }, 3000);
    }
    if (this.quantity > this.product.countInStock) {
      this.warningAlert = true;
      this.warningMessage =
        'Quntity Must be less than ' + this.product.countInStock;
      setTimeout(() => {
        this.warningAlert = false;
      }, 3000);
    }
  }
}
