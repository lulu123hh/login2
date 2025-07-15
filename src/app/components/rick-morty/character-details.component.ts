import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { Character } from '../../services/rick-morty.service';

@Component({
  selector: 'app-character-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatCardModule
  ],
  template: `
    <div class="character-details-dialog">
      <!-- Header con gradiente mejorado -->
      <div class="dialog-header">
        <div class="character-avatar-container">
          <div class="avatar-ring">
            <img [src]="data.character.image" [alt]="data.character.name" class="character-avatar" />
          </div>
          <div class="status-indicator" [class]="'status-' + data.character.status.toLowerCase()">
            <mat-icon>{{getStatusIcon(data.character.status)}}</mat-icon>
          </div>
        </div>
        
        <div class="character-title-section">
          <h2 mat-dialog-title class="character-name">{{data.character.name}}</h2>
          <div class="character-meta">
            <span class="species-badge">{{data.character.species}}</span>
            <span class="status-badge" [class]="'status-' + data.character.status.toLowerCase()">
              {{getStatusText(data.character.status)}}
            </span>
          </div>
          <div class="character-location">
            <mat-icon>location_on</mat-icon>
            <span>{{data.character.location.name}}</span>
          </div>
        </div>
        
        <button mat-icon-button mat-dialog-close class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Contenido mejorado -->
      <div mat-dialog-content class="dialog-content">
        <div class="details-grid">
          <div class="detail-card" *ngFor="let detail of characterDetails">
            <div class="detail-icon">
              <mat-icon>{{detail.icon}}</mat-icon>
            </div>
            <div class="detail-content">
              <div class="detail-label">{{detail.property}}</div>
              <div class="detail-value" [innerHTML]="detail.value"></div>
            </div>
          </div>
        </div>
        
        <!-- Sección de episodios más compacta -->
        <div class="episodes-section">
          <div class="episodes-info">
            <mat-icon>tv</mat-icon>
            <span class="episodes-text">Apariciones: </span>
            <span class="episodes-count">{{getEpisodeCount()}} episodios</span>
          </div>
        </div>
      </div>

      <!-- Footer mejorado -->
      <div mat-dialog-actions class="dialog-actions">
        <button mat-raised-button color="primary" mat-dialog-close class="close-btn">
          <mat-icon>check_circle</mat-icon>
          Entendido
        </button>
      </div>
    </div>
  `,
  styles: [`
    .character-details-dialog {
      max-width: 700px;
      width: 100%;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .dialog-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      display: flex;
      align-items: flex-start;
      gap: 25px;
      position: relative;
    }

    .character-avatar-container {
      position: relative;
      flex-shrink: 0;
    }

    .avatar-ring {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(45deg, #00d4aa, #00b894);
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }

    .character-avatar {
      width: 92px;
      height: 92px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid white;
    }

    .status-indicator {
      position: absolute;
      bottom: 5px;
      right: 5px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .status-indicator.status-alive {
      background: #4caf50;
      color: white;
    }

    .status-indicator.status-dead {
      background: #f44336;
      color: white;
    }

    .status-indicator.status-unknown {
      background: #ff9800;
      color: white;
    }

    .status-indicator mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .character-title-section {
      flex: 1;
    }

    .character-name {
      margin: 0 0 15px 0;
      font-size: 32px;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      line-height: 1.2;
    }

    .character-meta {
      display: flex;
      gap: 12px;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }

    .species-badge, .status-badge {
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .status-badge.status-alive {
      background: rgba(76, 175, 80, 0.9);
    }

    .status-badge.status-dead {
      background: rgba(244, 67, 54, 0.9);
    }

    .status-badge.status-unknown {
      background: rgba(255, 152, 0, 0.9);
    }

    .character-location {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      opacity: 0.9;
    }

    .character-location mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .close-button {
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      backdrop-filter: blur(10px);
    }

    .close-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    .dialog-content {
      padding: 0;
      max-height: 500px;
      overflow-y: auto;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 0;
      padding: 20px;
    }

    .detail-card {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 20px;
      border-bottom: 1px solid #f0f0f0;
      transition: all 0.3s ease;
    }

    .detail-card:hover {
      background: linear-gradient(135deg, #667eea10, #764ba210);
      transform: translateX(5px);
    }

    .detail-icon {
      width: 45px;
      height: 45px;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .detail-icon mat-icon {
      color: white;
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .detail-content {
      flex: 1;
    }

    .detail-label {
      font-size: 14px;
      color: #666;
      font-weight: 500;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-value {
      font-size: 18px;
      color: #333;
      font-weight: 600;
      line-height: 1.3;
    }

    .episodes-section {
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      padding: 15px 20px;
      margin: 15px 20px;
      border-radius: 12px;
      border: 1px solid #dee2e6;
    }

    .episodes-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #495057;
      font-size: 16px;
    }

    .episodes-info mat-icon {
      color: #667eea;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .episodes-text {
      font-weight: 500;
    }

    .episodes-count {
      font-weight: 700;
      color: #667eea;
    }

    .dialog-actions {
      padding: 25px;
      background: #f8f9fa;
      display: flex;
      justify-content: center;
      border-top: 1px solid #dee2e6;
    }

    .close-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 12px 30px;
      border-radius: 25px;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .close-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }

    .temp-badge {
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .dialog-content::-webkit-scrollbar {
      width: 8px;
    }

    .dialog-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .dialog-content::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 4px;
    }

    .dialog-content::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #5a67d8, #6b46c1);
    }

    @media (max-width: 600px) {
      .character-details-dialog {
        max-width: 95vw;
        margin: 10px;
      }

      .dialog-header {
        padding: 20px;
        flex-direction: column;
        text-align: center;
        gap: 15px;
      }

      .character-name {
        font-size: 24px;
      }

      .details-grid {
        grid-template-columns: 1fr;
        padding: 15px;
      }

      .detail-card {
        padding: 15px;
      }

      .episodes-section {
        margin: 10px 15px;
        padding: 12px 15px;
      }

      .episodes-info {
        font-size: 14px;
      }
    }
  `]
})
export class CharacterDetailsComponent {
  displayedColumns = ['property', 'value'];
  characterDetails: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<CharacterDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { character: Character }
  ) {
    this.prepareCharacterDetails();
  }

  private prepareCharacterDetails() {
    const character = this.data.character;
    console.log('Preparing character details for:', character);
    
    this.characterDetails = [
      {
        property: 'ID',
        value: character.id || 'N/A',
        icon: 'tag'
      },
      {
        property: 'Nombre',
        value: character.name || 'Desconocido',
        icon: 'person'
      },
      {
        property: 'Estado',
        value: `<span class="status-badge status-${(character.status || 'unknown').toLowerCase()}">${this.getStatusText(character.status || 'unknown')}</span>`,
        icon: 'favorite'
      },
      {
        property: 'Especie',
        value: character.species || 'Desconocida',
        icon: 'pets'
      },
      {
        property: 'Tipo',
        value: character.type || 'No especificado',
        icon: 'category'
      },
      {
        property: 'Género',
        value: this.getGenderText(character.gender || 'unknown'),
        icon: this.getGenderIcon(character.gender || 'unknown')
      },
      {
        property: 'Origen',
        value: character.origin?.name || 'Desconocido',
        icon: 'public'
      },
      {
        property: 'Ubicación',
        value: character.location?.name || 'Desconocida',
        icon: 'location_on'
      },
      {
        property: 'Creado',
        value: this.formatDate(character.created || ''),
        icon: 'schedule'
      }
    ];

    if (character.isTemporary) {
      this.characterDetails.unshift({
        property: 'Tipo de Personaje',
        value: '<span class="temp-badge">Personaje Temporal</span>',
        icon: 'new_releases'
      });
    }
    
    console.log('Character details prepared:', this.characterDetails);
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

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'alive': return '#4caf50';
      case 'dead': return '#f44336';
      case 'unknown': return '#ff9800';
      default: return '#666';
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

  getGenderText(gender: string): string {
    switch (gender.toLowerCase()) {
      case 'male': return 'Masculino';
      case 'female': return 'Femenino';
      case 'genderless': return 'Sin género';
      case 'unknown': return 'Desconocido';
      default: return gender;
    }
  }

  getGenderColor(gender: string): string {
    switch (gender.toLowerCase()) {
      case 'male': return '#2196f3';
      case 'female': return '#e91e63';
      case 'genderless': return '#9c27b0';
      case 'unknown': return '#607d8b';
      default: return '#666';
    }
  }

  getEpisodeCount(): number {
    return this.data.character.episode?.length || 0;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
