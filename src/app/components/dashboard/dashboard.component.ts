import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport mode="over">
        <mat-toolbar>Menú</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard/users" (click)="drawer.close()">
            <mat-icon>people</mat-icon>
            <span>Usuarios</span>
          </a>
          <a mat-list-item routerLink="/dashboard/rick-morty" (click)="drawer.close()">
            <mat-icon>science</mat-icon>
            <span>Rick y Morty</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button
            type="button"
            mat-icon-button
            (click)="drawer.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span>Portal de Administración</span>
          
          <span class="spacer"></span>
          
          <span class="user-info">
            Bienvenido, {{currentUser?.name}}
          </span>
          
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Cerrar Sesión</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 250px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-info {
      margin-right: 15px;
      font-size: 14px;
    }

    .content {
      padding: 20px;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }

    mat-nav-list a {
      display: flex !important;
      align-items: center;
      gap: 15px;
    }

    mat-nav-list mat-icon {
      color: #666;
    }
  `]
})
export class DashboardComponent {
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
