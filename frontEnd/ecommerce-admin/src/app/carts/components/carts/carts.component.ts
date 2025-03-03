import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CartsService } from '../../services/carts.service';
import { AuthService } from '../../../auth/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { start } from '@popperjs/core';

@Component({
  selector: 'app-carts',
  standalone: false,
  templateUrl: './carts.component.html',
  styleUrl: './carts.component.css',
})
export class CartsComponent {
  apiUrl = environment.apiUrl;
  filterForm!: FormGroup;
  orders: any[] = [];
  allOrders: any[] = [];
  total: number = 0;
  success: boolean = false;
  warningAlert: boolean = false;
  warningMessage: string = '';
  user: any = null;
  selectedOrder: any = null;
  isLoading: boolean = false;

  constructor(
    private service: CartsService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      start: [''],
      end: [''],
    });
    this.getAllOrders();
  }

  getAllOrders() {
    this.isLoading = true;
    this.service.getAllOrders().subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.isLoading = false;
          this.orders = res.data;
          this.allOrders = res.data;
        }
      },
      (err) => {
        this.isLoading = false;
        this.warningMessage = err.error.message;
        this.warningAlert = true;
        setTimeout(() => {
          this.warningAlert = false;
          this.warningMessage = '';
        }, 3000);
      }
    );
  }

  setAsDone(orderId: any) {
    this.service.updateOrderStatus(orderId, { status: 'done' }).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.success = true;
          this.getAllOrders();
          setTimeout(() => {
            this.success = false;
          }, 3000);
        }
      },
      (err) => {
        this.warningMessage = err.error.message;
        this.warningAlert = true;
        setTimeout(() => {
          this.warningAlert = false;
          this.warningMessage = '';
        }, 3000);
      }
    );
  }

  applyDateFilter() {
    const startDate = new Date(this.filterForm.value.start);
    const endDate = new Date(this.filterForm.value.end);

    this.orders = this.allOrders.filter((order: any) => {
      const orderDate = new Date(order.dateOrdered);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }

  openOrderDetails(orderid: any) {
    this.getSingleOrder(orderid);
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('orderDetailsModal')
    );
    modal.show();
  }

  getSingleOrder(orderId: any) {
    this.isLoading = true;
    this.service.getSingleOrder(orderId).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.isLoading = false;
          this.selectedOrder = res.data;
        }
      },
      (err) => {
        this.isLoading = false;
        alert(err.error.message);
      }
    );
  }
}
