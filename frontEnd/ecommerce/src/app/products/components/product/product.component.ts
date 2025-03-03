import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product',
  standalone: false,

  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  apiUrl = environment.apiUrl;
  @Input() product: any;
  @Output() item = new EventEmitter();
  addBtn: boolean = false;
  quantity: number = 1;
  warningAlert: boolean = false;
  warningMessage: string = '';
  successAlert: boolean = false;

  addToCartBtn() {
    this.validateQuantity();
    if (this.warningAlert == false) {
      this.item.emit({ item: this.product, quantity: this.quantity });
      this.addBtn = false;
      this.successAlert = true;
      setTimeout(() => {
        this.successAlert = false;
      }, 3000);
    } else {
      setTimeout(() => {
        this.warningAlert = false;
      }, 3000);
    }
  }

  validateQuantity() {
    if (this.quantity < 1) {
      this.warningAlert = true;
      this.warningMessage = 'Quntity Must be greater than 0';
    }
    if (this.quantity > this.product.countInStock) {
      this.warningAlert = true;
      this.warningMessage =
        'Quntity Must be less than ' + this.product.countInStock;
    }
  }
}
