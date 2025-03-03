import { Component, model } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { count } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: false,

  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  apiUrl = environment.apiUrl;
  cartProducts: any[] = [];
  total: number = 0;
  success: boolean = false;
  warningAlert: boolean = false;
  warningMessage: string = '';
  user: any = null;

  constructor(private service: CartService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getCartProducts();
    this.getCartTotalPrice();
    this.authService.user.subscribe((res: any) => (this.user = res));
  }

  getCartProducts() {
    if ('cart' in localStorage) {
      this.cartProducts = JSON.parse(localStorage.getItem('cart')!);
    }
  }

  getCartTotalPrice() {
    this.total = 0;
    this.cartProducts.forEach((product) => {
      this.total += product.item.price * product.quantity;
    });
  }

  clearCart() {
    this.cartProducts = [];
    this.getCartTotalPrice();
    localStorage.setItem('cart', JSON.stringify(this.cartProducts));
  }
  addAmount(index: any) {
    if (
      this.cartProducts[index].quantity <
      this.cartProducts[index].item.countInStock
    ) {
      this.cartProducts[index].quantity++;
      this.getCartTotalPrice();
      localStorage.setItem('cart', JSON.stringify(this.cartProducts));
      this.warningAlert = false;
    } else {
      this.warningMessage = `Cannot add more than ${this.cartProducts[index].item.countInStock} items.`;
      this.warningAlert = true;
      setTimeout(() => {
        this.warningAlert = false;
        this.warningMessage = '';
      }, 3000);
    }
  }
  minsAmount(index: any) {
    if (this.cartProducts[index].quantity > 1) {
      this.cartProducts[index].quantity--;
      this.getCartTotalPrice();
      localStorage.setItem('cart', JSON.stringify(this.cartProducts));
      this.warningAlert = false;
    } else {
      this.warningMessage = 'Quantity cannot be less than 1.';
      this.warningAlert = true;
      setTimeout(() => {
        this.warningAlert = false;
        this.warningMessage = '';
      }, 3000);
    }
  }
  detectChange(index: any) {
    const quantity = this.cartProducts[index].quantity;
    const countInStock = this.cartProducts[index].item.countInStock;

    if (quantity <= 1 || quantity > countInStock) {
      this.warningMessage =
        'quantity must be between 1 and ' + countInStock + '.';
      this.warningAlert = true;
      setTimeout(() => {
        this.warningAlert = false;
        this.warningMessage = '';
      }, 3000);
    } else {
      this.warningAlert = false;
    }
    this.getCartTotalPrice();
    localStorage.setItem('cart', JSON.stringify(this.cartProducts));
  }
  deleteProduct(index: any) {
    this.cartProducts.splice(index, 1);
    this.getCartTotalPrice();
    localStorage.setItem('cart', JSON.stringify(this.cartProducts));
  }
  addCart() {
    this.success = true;
    setTimeout(() => (this.success = false), 3000);
    this.addNewOrder();
  }

  addNewOrder() {
    const orderItems = this.cartProducts.map((item) => ({
      quantity: item.quantity,
      product: item.item._id,
    }));

    const model = {
      orderItems,
      shippingAddress1: this.user.shippingAddress1 || this.user.city,
      shippingAddress2: this.user.shippingAddress2 || this.user.city,
      city: this.user.city,
      zip: this.user.zip,
      country: this.user.country,
      phone: this.user.phone,
    };

    console.log(model);

    this.service.addNewOrder(model).subscribe((res: any) => {});
    this.clearCart();
  }
}
