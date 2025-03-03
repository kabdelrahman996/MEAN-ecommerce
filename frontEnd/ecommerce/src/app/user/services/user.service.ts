import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getUserProfile() {
    return this.http.get(`${this.apiUrl}/api/v1/users/get/profile`);
  }

  updateUserProfile(model: any) {
    return this.http.put(`${this.apiUrl}/api/v1/users/update/profile`, model);
  }
}
