import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Character } from '../../../services/rick-morty.service';

@Component({
  selector: 'app-character-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>{{isEdit ? 'edit' : 'add'}}</mat-icon>
      {{isEdit ? 'Editar' : 'Agregar'}} Personaje
    </h2>

    <mat-dialog-content>
      <form #characterForm="ngForm">
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Nombre</mat-label>
            <input matInput
                   [(ngModel)]="character.name"
                   name="name"
                   required
                   #nameInput="ngModel">
            <mat-error *ngIf="nameInput.invalid && nameInput.touched">
              El nombre es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Estado</mat-label>
            <mat-select [(ngModel)]="character.status" name="status" required>
              <mat-option value="Alive">Vivo</mat-option>
              <mat-option value="Dead">Muerto</mat-option>
              <mat-option value="unknown">Desconocido</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Especie</mat-label>
            <input matInput
                   [(ngModel)]="character.species"
                   name="species"
                   required
                   #speciesInput="ngModel">
            <mat-error *ngIf="speciesInput.invalid && speciesInput.touched">
              La especie es requerida
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Tipo</mat-label>
            <input matInput
                   [(ngModel)]="character.type"
                   name="type">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Género</mat-label>
            <mat-select [(ngModel)]="character.gender" name="gender" required>
              <mat-option value="Male">Masculino</mat-option>
              <mat-option value="Female">Femenino</mat-option>
              <mat-option value="Genderless">Sin género</mat-option>
              <mat-option value="unknown">Desconocido</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>URL de Imagen</mat-label>
            <input matInput
                   [(ngModel)]="character.image"
                   name="image"
                   type="url"
                   required
                   #imageInput="ngModel">
            <mat-error *ngIf="imageInput.invalid && imageInput.touched">
              La URL de imagen es requerida
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Origen</mat-label>
            <input matInput
                   [(ngModel)]="character.origin.name"
                   name="origin"
                   required
                   #originInput="ngModel">
            <mat-error *ngIf="originInput.invalid && originInput.touched">
              El origen es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Ubicación</mat-label>
            <input matInput
                   [(ngModel)]="character.location.name"
                   name="location"
                   required
                   #locationInput="ngModel">
            <mat-error *ngIf="locationInput.invalid && locationInput.touched">
              La ubicación es requerida
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Preview -->
        <div class="image-preview" *ngIf="character.image">
          <h4>Vista previa:</h4>
          <img [src]="character.image" [alt]="character.name" (error)="onImageError()">
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        <mat-icon>close</mat-icon>
        Cancelar
      </button>
      
      <button mat-raised-button
              color="primary"
              (click)="onSave()"
              [disabled]="characterForm.invalid">
        <mat-icon>save</mat-icon>
        {{isEdit ? 'Actualizar' : 'Agregar'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }

    .image-preview {
      text-align: center;
      margin-top: 20px;
    }

    .image-preview img {
      max-width: 200px;
      max-height: 200px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
    }

    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }
  `]
})
export class CharacterFormComponent {
  character: Character;
  isEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<CharacterFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Character | null
  ) {
    this.isEdit = !!data;
    this.character = data ? { ...data } : this.createEmptyCharacter();
  }

  private createEmptyCharacter(): Character {
    return {
      id: 0,
      name: '',
      status: 'Alive',
      species: '',
      type: '',
      gender: 'unknown',
      origin: {
        name: '',
        url: ''
      },
      location: {
        name: '',
        url: ''
      },
      image: '',
      episode: [],
      url: '',
      created: new Date().toISOString()
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.isValidCharacter()) {
      this.dialogRef.close(this.character);
    }
  }

  onImageError(): void {
    // Si la imagen no se puede cargar, usar una imagen por defecto
    this.character.image = 'https://via.placeholder.com/300x300?text=Sin+Imagen';
  }

  private isValidCharacter(): boolean {
    return !!(
      this.character.name &&
      this.character.species &&
      this.character.image &&
      this.character.origin.name &&
      this.character.location.name
    );
  }
}
