import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Character } from '../../services/rick-morty.service';

@Component({
  selector: 'app-character-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="character-form-modal">
      <!-- Header mejorado -->
      <div class="modal-header">
        <div class="header-content">
          <div class="header-icon">
            <mat-icon>{{character.id ? 'edit' : 'add'}}</mat-icon>
          </div>
          <h2 mat-dialog-title>{{character.id ? 'Editar Personaje' : 'Agregar Personaje'}}</h2>
        </div>
        <button mat-icon-button class="close-btn" (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <!-- Contenido del formulario -->
      <div class="modal-content">
        <form #characterForm="ngForm" class="form-content">
          <div class="form-section">
            <h3><mat-icon>person</mat-icon> Información Básica</h3>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nombre del personaje</mat-label>
                <input matInput 
                       [(ngModel)]="character.name" 
                       name="name" 
                       required
                       placeholder="Ingresa el nombre">
                <mat-icon matSuffix>person</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Estado</mat-label>
                <mat-select [(ngModel)]="character.status" name="status" required>
                  <mat-option value="Alive">🟢 Vivo</mat-option>
                  <mat-option value="Dead">🔴 Muerto</mat-option>
                  <mat-option value="unknown">⚪ Desconocido</mat-option>
                </mat-select>
                <mat-icon matSuffix>favorite</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Especie</mat-label>
                <mat-select [(ngModel)]="character.species" name="species" required>
                  <mat-option value="Human">👨 Humano</mat-option>
                  <mat-option value="Alien">👽 Alienígena</mat-option>
                  <mat-option value="Robot">🤖 Robot</mat-option>
                  <mat-option value="Animal">🐾 Animal</mat-option>
                  <mat-option value="Mythological Creature">🦄 Criatura Mitológica</mat-option>
                  <mat-option value="Unknown">❓ Desconocido</mat-option>
                </mat-select>
                <mat-icon matSuffix>pets</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Género</mat-label>
                <mat-select [(ngModel)]="character.gender" name="gender" required>
                  <mat-option value="Male">♂️ Masculino</mat-option>
                  <mat-option value="Female">♀️ Femenino</mat-option>
                  <mat-option value="Genderless">⚧️ Sin género</mat-option>
                  <mat-option value="unknown">❓ Desconocido</mat-option>
                </mat-select>
                <mat-icon matSuffix>wc</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Tipo específico</mat-label>
                <input matInput 
                       [(ngModel)]="character.type" 
                       name="type" 
                       placeholder="Tipo específico (opcional)">
                <mat-icon matSuffix>category</mat-icon>
              </mat-form-field>
            </div>
          </div>

          <div class="form-section">
            <h3><mat-icon>place</mat-icon> Ubicaciones</h3>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Lugar de origen</mat-label>
                <input matInput 
                       [(ngModel)]="character.origin.name" 
                       name="origin" 
                       required
                       placeholder="Ej: Tierra (Dimensión C-137)">
                <mat-icon matSuffix>home</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Ubicación actual</mat-label>
                <input matInput 
                       [(ngModel)]="character.location.name" 
                       name="location" 
                       required
                       placeholder="Ej: Citadel of Ricks">
                <mat-icon matSuffix>location_on</mat-icon>
              </mat-form-field>
            </div>
          </div>

          <div class="form-section">
            <h3><mat-icon>image</mat-icon> Imagen del personaje</h3>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>URL de la imagen</mat-label>
                <input matInput 
                       [(ngModel)]="character.image" 
                       name="image" 
                       type="url"
                       required
                       placeholder="https://...">
                <mat-icon matSuffix>link</mat-icon>
              </mat-form-field>
            </div>

            <!-- Preview de imagen mejorado -->
            <div *ngIf="character.image" class="image-preview">
              <div class="preview-container">
                <img [src]="character.image" [alt]="character.name" (error)="onImageError()">
                <div class="preview-overlay">
                  <mat-icon>visibility</mat-icon>
                  <span>Vista previa</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer con botones -->
      <div class="modal-footer">
        <button mat-button (click)="onCancel()" class="cancel-button">
          <mat-icon>close</mat-icon>
          Cancelar
        </button>
        <button mat-raised-button 
                color="primary" 
                (click)="onSave()" 
                [disabled]="!characterForm.valid"
                class="save-button">
          <mat-icon>{{character.id ? 'save' : 'add'}}</mat-icon>
          {{character.id ? 'Actualizar' : 'Crear'}}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .character-form-modal {
      max-width: 650px;
      width: 100%;
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    }

    .modal-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .header-icon {
      width: 45px;
      height: 45px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .header-icon mat-icon {
      color: white;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .close-btn {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    .modal-content {
      padding: 0;
      max-height: 70vh;
      overflow-y: auto;
    }

    .form-content {
      padding: 30px;
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .form-section {
      background: #f8f9fa;
      border-radius: 16px;
      padding: 25px;
      border: 1px solid #e9ecef;
    }

    .form-section h3 {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0 0 20px 0;
      color: #495057;
      font-size: 18px;
      font-weight: 600;
    }

    .form-section h3 mat-icon {
      color: #667eea;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .form-row {
      display: flex;
      gap: 20px;
      width: 100%;
      margin-bottom: 15px;
    }

    .form-row:last-child {
      margin-bottom: 0;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      width: 50%;
    }

    ::ng-deep .mat-mdc-form-field {
      font-family: inherit;
    }

    ::ng-deep .mat-mdc-form-field-outline {
      color: #dee2e6 !important;
    }

    ::ng-deep .mat-mdc-form-field-outline-thick {
      color: #667eea !important;
    }

    ::ng-deep .mat-mdc-floating-label {
      color: #6c757d !important;
    }

    ::ng-deep .mat-mdc-floating-label.mdc-floating-label--float-above {
      color: #667eea !important;
    }

    ::ng-deep .mat-mdc-form-field-icon-suffix {
      color: #6c757d;
    }

    ::ng-deep .mat-mdc-form-field-focus-overlay {
      background-color: transparent !important;
    }

    .image-preview {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }

    .preview-container {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    }

    .preview-container:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    }

    .preview-container img {
      width: 120px;
      height: 120px;
      object-fit: cover;
      display: block;
    }

    .preview-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8));
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: all 0.3s ease;
      gap: 5px;
    }

    .preview-container:hover .preview-overlay {
      opacity: 1;
    }

    .preview-overlay mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .preview-overlay span {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .modal-footer {
      background: #f8f9fa;
      padding: 25px 30px;
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      border-top: 1px solid #dee2e6;
    }

    .cancel-button {
      color: #6c757d;
      border: 2px solid #dee2e6;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .cancel-button:hover {
      background: #e9ecef;
      border-color: #adb5bd;
      color: #495057;
    }

    .save-button {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 12px 30px;
      border-radius: 12px;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      min-width: 140px;
    }

    .save-button:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }

    .save-button[disabled] {
      background: #dee2e6;
      color: #6c757d;
      box-shadow: none;
      cursor: not-allowed;
    }

    .modal-content::-webkit-scrollbar {
      width: 8px;
    }

    .modal-content::-webkit-scrollbar-track {
      background: #f1f3f4;
      border-radius: 4px;
    }

    .modal-content::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 4px;
    }

    .modal-content::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #5a67d8, #6b46c1);
    }

    @media (max-width: 768px) {
      .character-form-modal {
        max-width: 95vw;
        margin: 10px;
        border-radius: 16px;
      }

      .modal-header {
        padding: 20px;
      }

      .header-content {
        gap: 10px;
      }

      .header-icon {
        width: 40px;
        height: 40px;
      }

      h2 {
        font-size: 20px;
      }

      .form-content {
        padding: 20px;
        gap: 20px;
      }

      .form-section {
        padding: 20px;
      }

      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .half-width {
        width: 100%;
      }

      .modal-footer {
        padding: 20px;
        flex-direction: column;
      }

      .cancel-button,
      .save-button {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .character-form-modal {
        border-radius: 12px;
      }

      .modal-header {
        padding: 15px;
      }

      h2 {
        font-size: 18px;
      }

      .form-content {
        padding: 15px;
      }

      .form-section {
        padding: 15px;
        border-radius: 12px;
      }

      .modal-footer {
        padding: 15px;
      }
    }
  `]
})
export class CharacterFormComponent {
  character: Character;

  constructor(
    public dialogRef: MatDialogRef<CharacterFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { character: Character | null, isEdit: boolean }
  ) {
    this.character = data?.character ? { ...data.character } : this.createEmptyCharacter();
  }

  private createEmptyCharacter(): Character {
    return {
      id: 0,
      name: '',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: '', url: '' },
      location: { name: '', url: '' },
      image: '',
      episode: [],
      url: '',
      created: new Date().toISOString(),
      isTemporary: true
    };
  }

  onImageError(): void {
    // Si la imagen falla al cargar, usar una imagen por defecto
    this.character.image = 'https://via.placeholder.com/300x300/667eea/ffffff?text=' + 
                          encodeURIComponent(this.character.name || 'Character');
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Asegurar que los campos requeridos no estén vacíos
    if (!this.character.name || !this.character.origin.name || !this.character.location.name || !this.character.image) {
      return;
    }

    this.dialogRef.close(this.character);
  }
}
