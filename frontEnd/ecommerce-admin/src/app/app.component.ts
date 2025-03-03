import { Component } from '@angular/core';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ecommerce-admin';
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile() {
    return this.authService.getUserProfile().subscribe((res: any) => {
      if (res.status === 'success') {
        this.authService.user.next(res.data);
      } else this.authService.user.next(null);
    });
  }
}
