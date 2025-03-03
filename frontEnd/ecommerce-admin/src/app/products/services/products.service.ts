import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get(`${this.apiUrl}/api/v1/products`);
  }

  getAllCategories() {
    return this.http.get(`${this.apiUrl}/api/v1/categories`);
  }

  addProduct(formData: any) {
    return this.http.post(`${this.apiUrl}/api/v1/products`, formData);
  }

  updateExistingProduct(productId: any, model: any) {
    return this.http.put(`${this.apiUrl}/api/v1/products/${productId}`, model);
  }
}
