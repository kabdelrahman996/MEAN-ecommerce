import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get(`${this.apiUrl}/api/v1/products`);
  }

  getProductsByCategory(categoryId: String) {
    return this.http.get(
      `${this.apiUrl}/api/v1/products/specific/${categoryId}`
    );
  }
  getSingleProduct(productId: any) {
    return this.http.get(`${this.apiUrl}/api/v1/products/${productId}`);
  }

  getFeaturedProducts(count: any) {
    return this.http.get(`${this.apiUrl}/api/v1/get/featured/${count}`);
  }

  getAllCategories() {
    return this.http.get(`${this.apiUrl}/api/v1/categories`);
  }
}
