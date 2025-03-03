import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-login',
  standalone: false,

  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  dangerAlert: boolean = false;
  dangerMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    const model = this.loginForm.value;
    this.service.loginUser(model).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        this.getUserProile();
        this.router.navigate(['/home']);
      },
      (err) => {
        this.dangerMessage = err.error.message;
        this.dangerAlert = true;
        this.loginForm.reset();
        setTimeout(() => {
          this.dangerAlert = false;
          this.dangerMessage = '';
        }, 5000);
      }
    );
  }

  getUserProile() {
    this.service.getUserProfile().subscribe((res: any) => {
      if (res.status === 'success') {
        this.service.user.next(res.data);
      }
    });
  }
}
