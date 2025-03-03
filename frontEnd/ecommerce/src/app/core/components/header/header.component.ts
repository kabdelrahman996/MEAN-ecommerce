import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  user: any = null;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.user.subscribe((res: any) => {
      this.user = res;
    });
  }
  logout() {
    localStorage.removeItem('token');
    this.authService.user.next(null);
    this.user = null;
    this.router.navigate(['/login']);
  }
}
