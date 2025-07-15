import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <!-- Animated Background -->
      <div class="background">
        <!-- Portals -->
        <div class="portal portal-1"></div>
        <div class="portal portal-2"></div>
        
        <!-- Mountains -->
        <div class="mountains">
          <div class="mountain mountain-1"></div>
          <div class="mountain mountain-2"></div>
          <div class="mountain mountain-3"></div>
        </div>
        
        <!-- Floating objects -->
        <div class="floating-object object-1">🛸</div>
        <div class="floating-object object-2">⚡</div>
        <div class="floating-object object-3">🧪</div>
      </div>

      <!-- Login Card -->
      <div class="login-card">
        <div class="card-header">
          <div class="logo">
            <div class="rick-icon">🧪</div>
            <h1>Portal Login</h1>
            <p>Accede al multiverso</p>
          </div>
        </div>
        
        <div class="card-content">
          <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="login-form">
            <div class="form-group">
              <div class="input-container">
                <mat-icon class="input-icon">person</mat-icon>
                <input 
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  placeholder="Email"
                  required
                  #emailInput="ngModel"
                  class="form-input">
              </div>
              <div *ngIf="emailInput.invalid && emailInput.touched" class="error-message">
                Email es requerido
              </div>
            </div>

            <div class="form-group">
              <div class="input-container">
                <mat-icon class="input-icon">lock</mat-icon>
                <input 
                  [type]="hidePassword ? 'password' : 'text'"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="Password"
                  required
                  #passwordInput="ngModel"
                  class="form-input">
                <button type="button" 
                        class="toggle-password" 
                        (click)="hidePassword = !hidePassword">
                  <mat-icon>{{hidePassword ? 'visibility' : 'visibility_off'}}</mat-icon>
                </button>
              </div>
              <div *ngIf="passwordInput.invalid && passwordInput.touched" class="error-message">
                Password es requerido
              </div>
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe">
                <span class="checkmark"></span>
                Remember me
              </label>
              <a href="#" class="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" 
                    class="login-button"
                    [disabled]="loginForm.invalid || isLoading">
              <mat-icon *ngIf="!isLoading">rocket_launch</mat-icon>
              <mat-icon *ngIf="isLoading" class="loading-icon">autorenew</mat-icon>
              {{isLoading ? 'Connecting...' : 'Enter Portal'}}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * {
      box-sizing: border-box;
    }

    .login-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    /* Animated Background */
    .background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #00C9FF 0%, #92FE9D 30%, #FF6B9D 70%, #C44569 100%);
      z-index: -1;
    }

    .portal {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, #00FF88, #00C9FF);
      opacity: 0.6;
      animation: pulse 3s ease-in-out infinite;
    }

    .portal-1 {
      width: 200px;
      height: 200px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .portal-2 {
      width: 150px;
      height: 150px;
      bottom: 20%;
      right: 15%;
      animation-delay: 1.5s;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.2); opacity: 0.8; }
    }

    .mountains {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .mountain {
      position: absolute;
      bottom: 0;
    }

    .mountain-1 {
      left: 0;
      width: 0;
      height: 0;
      border-left: 300px solid transparent;
      border-right: 200px solid transparent;
      border-bottom: 200px solid rgba(196, 69, 105, 0.8);
    }

    .mountain-2 {
      left: 400px;
      width: 0;
      height: 0;
      border-left: 250px solid transparent;
      border-right: 300px solid transparent;
      border-bottom: 250px solid rgba(255, 107, 157, 0.7);
    }

    .mountain-3 {
      right: 0;
      width: 0;
      height: 0;
      border-left: 200px solid transparent;
      border-right: 250px solid transparent;
      border-bottom: 180px solid rgba(146, 254, 157, 0.6);
    }

    .floating-object {
      position: absolute;
      font-size: 24px;
      animation: float 4s ease-in-out infinite;
    }

    .object-1 {
      top: 20%;
      right: 25%;
      animation-delay: 0s;
    }

    .object-2 {
      top: 60%;
      left: 20%;
      animation-delay: 2s;
    }

    .object-3 {
      top: 40%;
      right: 10%;
      animation-delay: 1s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }

    /* Login Card */
    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 0;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.2);
      overflow: hidden;
      position: relative;
      z-index: 10;
    }

    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px 30px;
      text-align: center;
      color: white;
      position: relative;
    }

    .card-header::before {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 0 0 50% 50%;
    }

    .logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .rick-icon {
      font-size: 48px;
      animation: bounce 2s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .logo h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .logo p {
      margin: 0;
      font-size: 14px;
      opacity: 0.9;
    }

    .card-content {
      padding: 40px 30px 30px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .input-container {
      position: relative;
      display: flex;
      align-items: center;
      background: #f8f9fa;
      border-radius: 16px;
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .input-container:focus-within {
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .input-icon {
      color: #6c757d;
      margin: 0 16px 0 20px;
      font-size: 20px;
    }

    .form-input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 18px 16px 18px 0;
      font-size: 16px;
      color: #333;
      outline: none;
    }

    .form-input::placeholder {
      color: #6c757d;
      font-weight: 400;
    }

    .toggle-password {
      background: none;
      border: none;
      color: #6c757d;
      padding: 8px 16px;
      cursor: pointer;
      border-radius: 8px;
      transition: background-color 0.2s;
    }

    .toggle-password:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .toggle-password mat-icon {
      font-size: 20px;
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-left: 20px;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 0;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 14px;
      color: #666;
    }

    .remember-me input[type="checkbox"] {
      appearance: none;
      width: 18px;
      height: 18px;
      border: 2px solid #ddd;
      border-radius: 4px;
      position: relative;
      cursor: pointer;
    }

    .remember-me input[type="checkbox"]:checked {
      background-color: #667eea;
      border-color: #667eea;
    }

    .remember-me input[type="checkbox"]:checked::after {
      content: '✓';
      position: absolute;
      top: -2px;
      left: 2px;
      color: white;
      font-size: 12px;
      font-weight: bold;
    }

    .forgot-password {
      color: #667eea;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
    }

    .forgot-password:hover {
      text-decoration: underline;
    }

    .login-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 18px 24px;
      border-radius: 16px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .login-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
    }

    .login-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loading-icon {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 480px) {
      .login-container {
        padding: 10px;
      }

      .login-card {
        max-width: 100%;
      }

      .card-header {
        padding: 30px 20px 20px;
      }

      .card-content {
        padding: 30px 20px 20px;
      }

      .logo h1 {
        font-size: 24px;
      }

      .rick-icon {
        font-size: 40px;
      }

      .form-input {
        padding: 16px 12px 16px 0;
        font-size: 14px;
      }

      .mountain-1, .mountain-2, .mountain-3 {
        display: none;
      }

      .floating-object {
        font-size: 20px;
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  hidePassword = true;
  isLoading = false;
  rememberMe = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Si ya está logueado, redirigir al home
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onLogin(): void {
    if (!this.email || !this.password) return;

    this.isLoading = true;
    
    this.authService.login(this.email, this.password).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.snackBar.open('¡Bienvenido!', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/home']);
        } else {
          this.snackBar.open('Credenciales incorrectas', 'Cerrar', { duration: 3000 });
        }
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error al conectar con el servidor', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
