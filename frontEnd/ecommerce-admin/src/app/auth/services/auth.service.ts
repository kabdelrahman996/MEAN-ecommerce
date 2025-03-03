import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.apiUrl;

  user: any = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) {}

  loginUser(model: any) {
    return this.http.post(`${this.apiUrl}/api/v1/users/login`, model);
  }

  getUserProfile() {
    return this.http.get(`${this.apiUrl}/api/v1/users/get/profile`);
  }
}
