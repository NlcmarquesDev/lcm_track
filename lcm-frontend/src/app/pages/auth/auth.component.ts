import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  isLogin = signal(true);
  loading = signal(false);
  errorMsg = signal('');

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  toggleMode() {
    this.isLogin.update(v => !v);
    this.errorMsg.set('');
  }

  onLogin() {
    console.log('Form valid:', this.loginForm.valid);
    console.log('Form value:', this.loginForm.value);
    
    if (this.loginForm.invalid) return;
    this.loading.set(true);
    this.errorMsg.set('');

    const { email, password } = this.loginForm.value;
    console.log('Calling login with:', email, password);
    this.authService.login(email, password).subscribe({
      next: () => {
        this.authService.loadUser().subscribe({
          next: () => this.router.navigate(['/dashboard']),
          error: () => this.router.navigate(['/dashboard']),
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err.error?.message || err.error?.errors?.email?.[0] || 'Login failed');
      },
    });
  }

  onRegister() {
    if (this.registerForm.invalid) return;
    this.loading.set(true);
    this.errorMsg.set('');

    const { name, email, password } = this.registerForm.value;
    this.authService.register(name, email, password).subscribe({
      next: () => {
        this.authService.loadUser().subscribe({
          next: () => this.router.navigate(['/dashboard']),
          error: () => this.router.navigate(['/dashboard']),
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err.error?.message || 'Registration failed');
      },
    });
  }
}
