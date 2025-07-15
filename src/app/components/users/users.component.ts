import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService, User } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  template: `
    <div class="users-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <button mat-icon-button (click)="goBack()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div class="header-content">
            <h1>
              <mat-icon>person</mat-icon>
              Mi Perfil de Usuario
            </h1>
            <p class="subtitle">Información detallada de tu cuenta</p>
          </div>
        </div>
        <button mat-raised-button color="warn" (click)="logout()" class="logout-button">
          <mat-icon>logout</mat-icon>
          Cerrar Sesión
        </button>
      </div>
      
      <div class="content">
        <!-- Loading -->
        <div *ngIf="loading" class="loading">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Cargando información del usuario...</p>
        </div>

        <!-- User Information Table -->
        <div *ngIf="!loading && currentUser" class="table-wrapper">
          <div class="table-header">
            <h2>Información del Usuario</h2>
            <p>Datos completos de tu perfil de usuario</p>
          </div>
          
          <div class="table-container">
            <table mat-table [dataSource]="userDataSource" class="user-table">
              <!-- Campo Column -->
              <ng-container matColumnDef="field">
                <th mat-header-cell *matHeaderCellDef class="field-column">Campo</th>
                <td mat-cell *matCellDef="let element" class="field-cell">
                  <div class="field-info">
                    <mat-icon>{{element.icon}}</mat-icon>
                    <span class="field-label">{{element.label}}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Valor Column -->
              <ng-container matColumnDef="value">
                <th mat-header-cell *matHeaderCellDef class="value-column">Valor</th>
                <td mat-cell *matCellDef="let element" class="value-cell">
                  <div class="value-content" [ngSwitch]="element.type">
                    <!-- ID Badge -->
                    <span *ngSwitchCase="'id'" class="id-badge">{{element.value}}</span>
                    
                    <!-- Email -->
                    <span *ngSwitchCase="'email'" class="email-value">{{element.value}}</span>
                    
                    <!-- Role Badge -->
                    <span *ngSwitchCase="'role'" class="role-badge" [ngClass]="'role-' + element.value">
                      <mat-icon>{{getRoleIcon(element.value)}}</mat-icon>
                      {{getRoleText(element.value)}}
                    </span>
                    
                    <!-- Status Badge -->
                    <span *ngSwitchCase="'status'" class="status-badge active">
                      <mat-icon>check_circle</mat-icon>
                      Activo
                    </span>
                    
                    <!-- Date -->
                    <div *ngSwitchCase="'date'" class="date-info">
                      <span class="date">{{formatDate(element.value)}}</span>
                      <span class="time">{{formatTime(element.value)}}</span>
                    </div>
                    
                    <!-- Avatar -->
                    <div *ngSwitchCase="'avatar'" class="avatar-cell">
                      <img [src]="element.value" [alt]="currentUser.name" class="user-avatar">
                    </div>
                    
                    <!-- Default text -->
                    <span *ngSwitchDefault>{{element.value}}</span>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
            </table>
          </div>
        </div>

        <!-- No Data -->
        <div *ngIf="!loading && !currentUser" class="no-data">
          <mat-icon>error_outline</mat-icon>
          <h3>Error al cargar el perfil</h3>
          <p>No se pudo obtener la información del usuario</p>
          <button mat-raised-button color="primary" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .page-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 25px 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;
      flex: 1;
    }

    .back-button {
      background: #f5f5f5;
      border-radius: 50%;
      width: 48px;
      height: 48px;
    }

    .back-button:hover {
      background: #e0e0e0;
      transform: scale(1.05);
    }

    .header-content h1 {
      margin: 0;
      color: #333;
      font-size: 28px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-content h1 mat-icon {
      color: #667eea;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .subtitle {
      margin: 5px 0 0 0;
      color: #666;
      font-size: 14px;
    }

    .logout-button {
      min-width: 140px;
      height: 48px;
      border-radius: 24px;
      font-weight: 600;
    }

    .logout-button mat-icon {
      margin-right: 8px;
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      padding: 80px 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      color: #333;
    }

    .table-wrapper {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .table-header {
      padding: 30px;
      border-bottom: 2px solid #f0f0f0;
      background: rgba(255, 255, 255, 0.8);
    }

    .table-header h2 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 24px;
      font-weight: 600;
    }

    .table-header p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .table-container {
      overflow-x: auto;
    }

    .user-table {
      width: 100%;
      min-width: 600px;
    }

    .user-table th {
      background-color: #fafafa;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #e0e0e0;
      padding: 20px 16px;
      font-size: 16px;
    }

    .user-table td {
      padding: 20px 16px;
      border-bottom: 1px solid #f0f0f0;
      vertical-align: middle;
    }

    .table-row:hover {
      background-color: #f8f9fa;
    }

    .table-row:last-child td {
      border-bottom: none;
    }

    .field-column {
      width: 250px;
    }

    .value-column {
      width: auto;
    }

    .field-cell {
      font-weight: 500;
    }

    .field-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .field-info mat-icon {
      color: #667eea;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .field-label {
      font-size: 15px;
      color: #333;
    }

    .value-content {
      display: flex;
      align-items: center;
    }

    .id-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      display: inline-block;
      min-width: 40px;
      text-align: center;
    }

    .email-value {
      font-family: 'Courier New', monospace;
      background: #f8f9fa;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      color: #333;
    }

    .role-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .role-badge.role-admin {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    .role-badge.role-customer {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    .role-badge mat-icon {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
    }

    .status-badge.active {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status-badge mat-icon {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
    }

    .date-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .date {
      font-weight: 500;
      color: #333;
      font-size: 15px;
    }

    .time {
      font-size: 13px;
      color: #999;
    }

    .avatar-cell {
      display: flex;
      align-items: center;
    }

    .user-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      border: 3px solid white;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 25px;
      padding: 80px 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      text-align: center;
      color: #333;
    }

    .no-data mat-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: #ccc;
    }

    .no-data h3 {
      margin: 0;
      font-weight: 500;
      font-size: 1.5rem;
    }

    .no-data p {
      margin: 0;
      color: #666;
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .page-header {
        padding: 20px;
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
      }
      
      .header-left {
        justify-content: flex-start;
      }
      
      .header-content h1 {
        font-size: 24px;
      }
      
      .content {
        padding: 30px 15px;
      }
      
      .table-header {
        padding: 20px;
      }
      
      .table-header h2 {
        font-size: 20px;
      }
      
      .user-table th,
      .user-table td {
        padding: 16px 12px;
      }
      
      .field-column {
        width: 200px;
      }
      
      .field-info {
        gap: 8px;
      }
      
      .field-label {
        font-size: 14px;
      }
      
      .user-avatar {
        width: 50px;
        height: 50px;
      }
    }

    @media (max-width: 480px) {
      .header-content h1 {
        font-size: 20px;
      }
      
      .subtitle {
        font-size: 12px;
      }
      
      .logout-button {
        min-width: 120px;
        height: 44px;
        font-size: 14px;
      }
      
      .field-column {
        width: 150px;
      }
      
      .field-info mat-icon {
        display: none;
      }
    }
  `]
})
export class UsersComponent implements OnInit {
  currentUser: User | null = null;
  loading = true;
  
  // Propiedades para la tabla
  displayedColumns = ['field', 'value'];
  userDataSource: any[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loading = false;
    
    if (this.currentUser) {
      this.setupUserDataSource();
    }
  }

  setupUserDataSource(): void {
    if (!this.currentUser) return;
    
    this.userDataSource = [
      {
        label: 'Avatar',
        value: this.currentUser.avatar,
        type: 'avatar',
        icon: 'account_circle'
      },
      {
        label: 'ID de Usuario',
        value: this.currentUser.id,
        type: 'id',
        icon: 'fingerprint'
      },
      {
        label: 'Nombre Completo',
        value: this.currentUser.name,
        type: 'text',
        icon: 'person'
      },
      {
        label: 'Correo Electrónico',
        value: this.currentUser.email,
        type: 'email',
        icon: 'email'
      },
      {
        label: 'Rol del Sistema',
        value: this.currentUser.role,
        type: 'role',
        icon: 'admin_panel_settings'
      },
      {
        label: 'Estado de la Cuenta',
        value: 'active',
        type: 'status',
        icon: 'verified'
      },
      {
        label: 'Fecha de Registro',
        value: this.currentUser.creationAt,
        type: 'date',
        icon: 'event'
      },
      {
        label: 'Última Actualización',
        value: this.currentUser.updatedAt,
        type: 'date',
        icon: 'update'
      }
    ];
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES');
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  getRoleText(role: string): string {
    const roleMap: Record<string, string> = {
      'admin': 'Administrador',
      'customer': 'Cliente'
    };
    return roleMap[role] || role;
  }

  getRoleIcon(role: string): string {
    const iconMap: Record<string, string> = {
      'admin': 'admin_panel_settings',
      'customer': 'person'
    };
    return iconMap[role] || 'person';
  }

  logout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
