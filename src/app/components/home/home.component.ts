import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule
  ],
  template: `
    <div class="home-container">
      <!-- Header -->
      <mat-toolbar color="primary" class="header-toolbar">
        <span class="welcome-text">
          <mat-icon>account_circle</mat-icon>
          Bienvenido, {{currentUser?.name}}
        </span>
        
        <span class="spacer"></span>
        
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Cerrar Sesión</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <!-- Main Content -->
      <div class="content">
        <div class="hero-section">
          <h1>Portal de Administración</h1>
          <p>Selecciona una opción para continuar</p>
        </div>

        <div class="menu-cards">
          <mat-card class="menu-card users-card" (click)="goToUsers()">
            <mat-card-header>
              <div mat-card-avatar class="card-avatar users-avatar">
                <mat-icon>people</mat-icon>
              </div>
              <mat-card-title>Usuarios</mat-card-title>
              <mat-card-subtitle>Gestión de usuarios del sistema</mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <p>Visualiza y administra todos los usuarios registrados en el sistema.</p>
              <ul>
                <li>Ver perfiles completos</li>
                <li>Información de contacto</li>
                <li>Roles y permisos</li>
                <li>Fechas de registro</li>
              </ul>
            </mat-card-content>
            
            <mat-card-actions>
              <button mat-raised-button color="primary">
                <mat-icon>arrow_forward</mat-icon>
                Acceder
              </button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="menu-card rick-morty-card" (click)="goToRickMorty()">
            <mat-card-header>
              <div mat-card-avatar class="card-avatar rick-morty-avatar">
                <mat-icon>science</mat-icon>
              </div>
              <mat-card-title>Rick y Morty</mat-card-title>
              <mat-card-subtitle>Explorador de personajes</mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <p>Explora el universo de Rick y Morty con herramientas avanzadas.</p>
              <ul>
                <li>Catálogo completo de personajes</li>
                <li>Filtros y búsqueda avanzada</li>
                <li>Edición temporal (CRUD)</li>
                <li>Navegación paginada</li>
              </ul>
            </mat-card-content>
            
            <mat-card-actions>
              <button mat-raised-button color="accent">
                <mat-icon>arrow_forward</mat-icon>
                Explorar
              </button>
            </mat-card-actions>
          </mat-card>
        </div>

        <!-- User Info Card -->
        <mat-card class="user-info-card">
          <mat-card-header>
            <div mat-card-avatar>
              <img [src]="currentUser?.avatar" [alt]="currentUser?.name" />
            </div>
            <mat-card-title>{{currentUser?.name}}</mat-card-title>
            <mat-card-subtitle>{{currentUser?.email}} • {{currentUser?.role}}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="user-details">
              <div class="detail-item">
                <mat-icon>badge</mat-icon>
                <span>ID: {{currentUser?.id}}</span>
              </div>
              <div class="detail-item">
                <mat-icon>calendar_today</mat-icon>
                <span>Miembro desde: {{formatDate(currentUser?.creationAt)}}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .header-toolbar {
      background: rgba(255, 255, 255, 0.95) !important;
      color: #333 !important;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    }

    .welcome-text {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .welcome-text mat-icon {
      color: #667eea;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 60px 20px 40px;
    }

    .hero-section {
      text-align: center;
      margin-bottom: 60px;
      color: white;
    }

    .hero-section h1 {
      font-size: 3.5rem;
      margin-bottom: 15px;
      font-weight: 300;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .hero-section p {
      font-size: 1.3rem;
      margin-bottom: 0;
      opacity: 0.9;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }

    .menu-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 40px;
      margin-bottom: 60px;
    }

    .menu-card {
      background: white;
      border-radius: 20px;
      padding: 0;
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
      cursor: pointer;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      border: none;
    }

    .menu-card:hover {
      transform: translateY(-15px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }

    .menu-card mat-card-header {
      padding: 30px 30px 20px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .menu-card mat-card-content {
      padding: 25px 30px;
    }

    .menu-card mat-card-actions {
      padding: 0 30px 30px !important;
      justify-content: flex-end;
    }

    .card-avatar {
      width: 70px !important;
      height: 70px !important;
      border-radius: 20px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .users-avatar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
    }

    .rick-morty-avatar {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
      color: white !important;
    }

    .card-avatar mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
    }

    mat-card-title {
      font-size: 1.8rem !important;
      font-weight: 600 !important;
      color: #333 !important;
      margin-bottom: 8px !important;
    }

    mat-card-subtitle {
      font-size: 1rem !important;
      color: #666 !important;
    }

    mat-card-content p {
      font-size: 1rem;
      color: #555;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    mat-card-content ul {
      margin: 0;
      padding-left: 20px;
    }

    mat-card-content li {
      margin-bottom: 8px;
      color: #666;
      font-size: 0.95rem;
      position: relative;
    }

    mat-card-content li::marker {
      color: #667eea;
    }

    mat-card-actions button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 25px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 500;
      text-transform: none;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
    }

    .rick-morty-card mat-card-actions button {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
    }

    mat-card-actions button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }

    .rick-morty-card mat-card-actions button:hover {
      box-shadow: 0 6px 20px rgba(240, 147, 251, 0.6);
    }

    .user-info-card {
      max-width: 600px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .user-info-card mat-card-header {
      padding: 25px 25px 15px;
    }

    .user-info-card mat-card-content {
      padding: 0 25px 25px;
    }

    .user-info-card img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      border: 3px solid white;
    }

    .user-info-card mat-card-title {
      font-size: 1.5rem !important;
      color: #333 !important;
    }

    .user-info-card mat-card-subtitle {
      color: #666 !important;
      font-size: 0.95rem !important;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #555;
      padding: 12px 16px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .detail-item mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
      color: #667eea;
    }

    @media (max-width: 768px) {
      .hero-section h1 {
        font-size: 2.5rem;
      }
      
      .hero-section p {
        font-size: 1.1rem;
      }
      
      .menu-cards {
        grid-template-columns: 1fr;
        gap: 30px;
      }
      
      .content {
        padding: 40px 15px 30px;
      }

      .menu-card mat-card-header,
      .menu-card mat-card-content,
      .menu-card mat-card-actions {
        padding-left: 20px;
        padding-right: 20px;
      }
    }

    @media (max-width: 480px) {
      .hero-section h1 {
        font-size: 2rem;
      }
      
      .card-avatar {
        width: 60px !important;
        height: 60px !important;
      }
      
      .card-avatar mat-icon {
        font-size: 30px;
        width: 30px;
        height: 30px;
      }
    }
  `]
})
export class HomeComponent {
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  goToUsers(): void {
    this.router.navigate(['/users']);
  }

  goToRickMorty(): void {
    this.router.navigate(['/rick-morty']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES');
  }
}
