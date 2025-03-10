import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  addNewOrder(model: any) {
    return this.http.post(`${this.apiUrl}/api/v1/orders`, model);
  }
}
