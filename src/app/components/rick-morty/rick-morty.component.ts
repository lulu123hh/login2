import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { RickMortyService, Character } from '../../services/rick-morty.service';

@Component({
  selector: 'app-rick-morty',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="rick-morty-container">
      <!-- Header -->
      <div class="page-header">
        <button mat-icon-button class="back-button" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-content">
          <h1>
            <mat-icon>science</mat-icon>
            Rick & Morty Characters
          </h1>
        </div>
      </div>
      <div class="subtitle">Explora el universo de Rick y Morty</div>

      <!-- Content -->
      <div class="content">
        <!-- Search and Filters -->
        <div class="filters-card">
          <div class="filter-row">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar personaje</mat-label>
              <input matInput placeholder="Nombre del personaje" [(ngModel)]="searchTerm" (keyup.enter)="search()">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Estado</mat-label>
              <mat-select [(ngModel)]="statusFilter">
                <mat-option value="">Todos</mat-option>
                <mat-option value="alive">Vivo</mat-option>
                <mat-option value="dead">Muerto</mat-option>
                <mat-option value="unknown">Desconocido</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Especie</mat-label>
              <mat-select [(ngModel)]="speciesFilter">
                <mat-option value="">Todas</mat-option>
                <mat-option value="Human">Humano</mat-option>
                <mat-option value="Alien">Alienígena</mat-option>
                <mat-option value="Robot">Robot</mat-option>
                <mat-option value="Animal">Animal</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="search()" class="search-button">
              <mat-icon>search</mat-icon>
              Buscar
            </button>

            <button mat-raised-button (click)="clearFilters()" class="clear-button">
              <mat-icon>clear</mat-icon>
              Limpiar
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="loading">
          <mat-spinner></mat-spinner>
          <p>Cargando personajes de Rick & Morty...</p>
        </div>

        <!-- Characters Table -->
        <div *ngIf="!loading && characters.length > 0" class="table-wrapper">
          <div class="table-header">
            <h2>Personajes</h2>
            <p>{{totalResults}} personajes encontrados</p>
          </div>
          
          <div class="table-container">
            <table mat-table [dataSource]="characters" class="characters-table">
              <!-- Image Column -->
              <ng-container matColumnDef="image">
                <th mat-header-cell *matHeaderCellDef class="avatar-column">Avatar</th>
                <td mat-cell *matCellDef="let character" class="avatar-cell">
                  <img [src]="character.image" [alt]="character.name" class="character-avatar">
                </td>
              </ng-container>

              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let character">
                  <span class="id-badge">{{character.id}}</span>
                </td>
              </ng-container>

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let character">
                  <div class="character-name">{{character.name}}</div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let character">
                  <span class="status-badge" [ngClass]="'status-' + character.status.toLowerCase()">
                    <mat-icon>{{getStatusIcon(character.status)}}</mat-icon>
                    {{getStatusText(character.status)}}
                  </span>
                </td>
              </ng-container>

              <!-- Species Column -->
              <ng-container matColumnDef="species">
                <th mat-header-cell *matHeaderCellDef>Especie</th>
                <td mat-cell *matCellDef="let character">
                  <span class="species-badge">{{character.species}}</span>
                </td>
              </ng-container>

              <!-- Gender Column -->
              <ng-container matColumnDef="gender">
                <th mat-header-cell *matHeaderCellDef>Género</th>
                <td mat-cell *matCellDef="let character">
                  <span class="gender-info">
                    <mat-icon>{{getGenderIcon(character.gender)}}</mat-icon>
                    {{character.gender}}
                  </span>
                </td>
              </ng-container>

              <!-- Location Column -->
              <ng-container matColumnDef="location">
                <th mat-header-cell *matHeaderCellDef>Ubicación</th>
                <td mat-cell *matCellDef="let character">
                  <div class="location-info">
                    <mat-icon>place</mat-icon>
                    {{character.location.name}}
                  </div>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let character" class="actions-cell">
                  <button mat-icon-button color="primary" 
                          matTooltip="Ver detalles"
                          (click)="viewDetails(character)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent"
                          matTooltip="Agregar a favoritos"
                          (click)="toggleFavorite(character)">
                    <mat-icon>{{isFavorite(character) ? 'favorite' : 'favorite_border'}}</mat-icon>
                  </button>
                  <button mat-icon-button color="warn"
                          matTooltip="Compartir"
                          (click)="shareCharacter(character)">
                    <mat-icon>share</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination-container">
            <div class="pagination-info">
              Mostrando {{(currentPage - 1) * 20 + 1}} - {{Math.min(currentPage * 20, totalResults)}} de {{totalResults}} resultados
            </div>
            <div class="pagination-controls">
              <button mat-icon-button [disabled]="currentPage === 1" (click)="previousPage()">
                <mat-icon>chevron_left</mat-icon>
              </button>
              <span class="page-indicator">Página {{currentPage}} de {{totalPages}}</span>
              <button mat-icon-button [disabled]="currentPage === totalPages" (click)="nextPage()">
                <mat-icon>chevron_right</mat-icon>
              </button>
            </div>
          </div>
        </div>

        <!-- No Data State -->
        <div *ngIf="!loading && characters.length === 0" class="no-data">
          <mat-icon>search_off</mat-icon>
          <h3>No se encontraron personajes</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
          <button mat-raised-button color="primary" (click)="clearFilters()">
            <mat-icon>refresh</mat-icon>
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rick-morty-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    }

    .page-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 25px 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 20px;
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
      color: #11998e;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .subtitle {
      margin: 5px 0 0 44px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      padding: 10px 30px;
    }

    .content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .filters-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 25px;
      margin-bottom: 25px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .filter-row {
      display: flex;
      gap: 15px;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 2;
      min-width: 250px;
    }

    .filter-field {
      flex: 1;
      min-width: 150px;
    }

    .search-button,
    .clear-button {
      margin-top: 8px;
      height: 56px;
      min-width: 120px;
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
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      color: #333;
    }

    .table-wrapper {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    }

    .table-header {
      padding: 25px 30px;
      border-bottom: 1px solid #f0f0f0;
      background: rgba(255, 255, 255, 0.8);
    }

    .table-header h2 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 22px;
      font-weight: 600;
    }

    .table-header p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .table-container {
      overflow-x: auto;
      max-height: 700px;
    }

    .characters-table {
      width: 100%;
      min-width: 1200px;
    }

    .characters-table th {
      background-color: #fafafa;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #e0e0e0;
      padding: 16px 12px;
      font-size: 14px;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .characters-table td {
      padding: 16px 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .table-row:hover {
      background-color: #f8f9fa;
    }

    .avatar-column {
      width: 80px;
      text-align: center;
    }

    .avatar-cell {
      text-align: center;
    }

    .character-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 3px 12px rgba(0,0,0,0.15);
      border: 3px solid white;
    }

    .id-badge {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
      min-width: 30px;
      text-align: center;
    }

    .character-name {
      font-weight: 500;
      color: #333;
      font-size: 15px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
    }

    .status-badge.status-alive {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status-badge.status-dead {
      background: #ffebee;
      color: #c62828;
    }

    .status-badge.status-unknown {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .status-badge mat-icon {
      font-size: 16px !important;
      width: 16px !important;
      height: 16px !important;
    }

    .species-badge {
      background: #e3f2fd;
      color: #1976d2;
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: 500;
    }

    .gender-info {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #666;
    }

    .gender-info mat-icon {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
    }

    .location-info {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #666;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .location-info mat-icon {
      font-size: 16px !important;
      width: 16px !important;
      height: 16px !important;
      color: #ff9800;
    }

    .actions-cell {
      display: flex;
      gap: 4px;
    }

    .actions-cell button {
      width: 36px;
      height: 36px;
      border-radius: 8px;
    }

    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 30px;
      background: rgba(255, 255, 255, 0.8);
      border-top: 1px solid #f0f0f0;
    }

    .pagination-info {
      color: #666;
      font-size: 14px;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .page-indicator {
      color: #333;
      font-weight: 500;
      font-size: 14px;
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
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
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
      }
      
      .header-content h1 {
        font-size: 24px;
      }
      
      .content {
        padding: 20px 15px;
      }
      
      .filters-card {
        padding: 20px;
      }
      
      .filter-row {
        flex-direction: column;
      }
      
      .search-field,
      .filter-field {
        width: 100%;
        min-width: auto;
      }
      
      .table-header {
        padding: 20px;
      }
      
      .characters-table {
        font-size: 14px;
      }
      
      .characters-table th,
      .characters-table td {
        padding: 12px 8px;
      }
      
      .character-avatar {
        width: 40px;
        height: 40px;
      }
      
      .pagination-container {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .header-content h1 {
        font-size: 20px;
      }
      
      .subtitle {
        font-size: 12px;
      }
    }
  `]
})
export class RickMortyComponent implements OnInit {
  characters: Character[] = [];
  loading = true;
  searchTerm = '';
  statusFilter = '';
  speciesFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalResults = 0;
  favorites: Set<number> = new Set();
  Math = Math;

  displayedColumns = ['image', 'id', 'name', 'status', 'species', 'gender', 'location', 'actions'];

  constructor(
    private rickMortyService: RickMortyService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCharacters();
    this.loadFavorites();
  }

  loadCharacters() {
    this.loading = true;
    
    const filters = {
      name: this.searchTerm || undefined,
      status: this.statusFilter || undefined,
      species: this.speciesFilter || undefined,
      page: this.currentPage
    };

    this.rickMortyService.getCharacters(filters).subscribe({
      next: (response) => {
        this.characters = response.results;
        this.totalResults = response.info.count;
        this.totalPages = response.info.pages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading characters:', error);
        this.loading = false;
        this.snackBar.open('Error al cargar personajes', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  search() {
    this.currentPage = 1;
    this.loadCharacters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.speciesFilter = '';
    this.currentPage = 1;
    this.loadCharacters();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCharacters();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCharacters();
    }
  }

  viewDetails(character: Character) {
    this.snackBar.open(`Viendo detalles de ${character.name}`, 'Cerrar', {
      duration: 2000
    });
  }

  toggleFavorite(character: Character) {
    if (this.favorites.has(character.id)) {
      this.favorites.delete(character.id);
      this.snackBar.open(`${character.name} eliminado de favoritos`, 'Cerrar', {
        duration: 2000
      });
    } else {
      this.favorites.add(character.id);
      this.snackBar.open(`${character.name} agregado a favoritos`, 'Cerrar', {
        duration: 2000
      });
    }
    this.saveFavorites();
  }

  isFavorite(character: Character): boolean {
    return this.favorites.has(character.id);
  }

  shareCharacter(character: Character) {
    if (navigator.share) {
      navigator.share({
        title: `Rick & Morty - ${character.name}`,
        text: `Mira este personaje de Rick & Morty: ${character.name}`,
        url: window.location.href
      });
    } else {
      this.snackBar.open('Función de compartir no disponible', 'Cerrar', {
        duration: 2000
      });
    }
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'alive': return 'favorite';
      case 'dead': return 'dangerous';
      case 'unknown': return 'help_outline';
      default: return 'help_outline';
    }
  }

  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'alive': return 'Vivo';
      case 'dead': return 'Muerto';
      case 'unknown': return 'Desconocido';
      default: return status;
    }
  }

  getGenderIcon(gender: string): string {
    switch (gender.toLowerCase()) {
      case 'male': return 'male';
      case 'female': return 'female';
      case 'genderless': return 'transgender';
      case 'unknown': return 'help_outline';
      default: return 'help_outline';
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  private loadFavorites() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('rickMortyFavorites');
      if (saved) {
        this.favorites = new Set(JSON.parse(saved));
      }
    }
  }

  private saveFavorites() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('rickMortyFavorites', JSON.stringify([...this.favorites]));
    }
  }
}
