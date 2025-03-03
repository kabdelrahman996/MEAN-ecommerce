import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: false,

  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  userForm!: FormGroup;
  user: any;
  isLoading = true;
  isUpdating = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserProfileData();
  }

  getUserProfileData() {
    this.userService.getUserProfile().subscribe({
      next: (res: any) => {
        this.user = res.data;
        this.initForm();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching user data:', err.error.message);
        this.isLoading = false;
      },
    });
  }

  initForm() {
    this.userForm = this.fb.group({
      name: [this.user?.name || '', Validators.required],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      phone: [this.user?.phone || '', Validators.required],
      shippingAddress1: [this.user?.city || '', Validators.required],
      shippingAddress2: [this.user?.shippingAddress2 || ''],
      city: [this.user?.city || '', Validators.required],
      zip: [this.user?.zip || '', Validators.required],
      country: [this.user?.country || '', Validators.required],
    });
  }

  updateUserProfile() {
    if (this.userForm.invalid) return;

    this.isUpdating = true;
    this.userService.updateUserProfile(this.userForm.value).subscribe({
      next: (res) => {
        this.successMessage = 'User updated successfully!';
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/products']);
        }, 3000);
        this.isUpdating = false;
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.isUpdating = false;
      },
    });
  }
}
