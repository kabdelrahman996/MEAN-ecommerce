import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartsService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllOrders() {
    return this.http.get(`${this.apiUrl}/api/v1/orders`);
  }

  updateOrderStatus(orderId: any, model: any) {
    return this.http.put(`${this.apiUrl}/api/v1/orders/${orderId}`, model);
  }

  getSingleOrder(orderId: any) {
    return this.http.get(`${this.apiUrl}/api/v1/orders/${orderId}`);
  }
}
