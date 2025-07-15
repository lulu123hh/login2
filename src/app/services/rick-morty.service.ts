import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
  isTemporary?: boolean; // Para marcar personajes temporales
}

export interface CharacterResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

@Injectable({
  providedIn: 'root'
})
export class RickMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';
  private temporaryCharacters = new BehaviorSubject<Character[]>([]);
  private deletedCharacterIds = new Set<number>();
  private nextTempId = 10000; // IDs altos para evitar conflictos

  constructor(private http: HttpClient) {}

  getCharacters(filters?: {
    page?: number;
    name?: string;
    status?: string;
    species?: string;
    gender?: string;
  }): Observable<CharacterResponse> {
    let url = `${this.apiUrl}?page=${filters?.page || 1}`;
    
    if (filters?.name) url += `&name=${filters.name}`;
    if (filters?.status) url += `&status=${filters.status}`;
    if (filters?.species) url += `&species=${filters.species}`;
    if (filters?.gender) url += `&gender=${filters.gender}`;

    return this.http.get<CharacterResponse>(url).pipe(
      map(response => {
        // Filtrar personajes eliminados
        const filteredResults = response.results.filter(char => !this.deletedCharacterIds.has(char.id));
        
        // Agregar personajes temporales solo en la primera página y sin filtros de búsqueda
        if ((!filters?.page || filters.page === 1) && !filters?.name && !filters?.status && !filters?.species && !filters?.gender) {
          const tempChars = this.temporaryCharacters.value;
          return {
            ...response,
            results: [...tempChars, ...filteredResults],
            info: {
              ...response.info,
              count: response.info.count + tempChars.length - this.deletedCharacterIds.size
            }
          };
        }
        
        return {
          ...response,
          results: filteredResults,
          info: {
            ...response.info,
            count: response.info.count - this.deletedCharacterIds.size
          }
        };
      })
    );
  }

  getCharacterById(id: number): Observable<Character> {
    // Verificar si es un personaje temporal
    const tempChar = this.temporaryCharacters.value.find(char => char.id === id);
    if (tempChar) {
      return of(tempChar);
    }
    
    return this.http.get<Character>(`${this.apiUrl}/${id}`);
  }

  addCharacter(character: Omit<Character, 'id' | 'url' | 'created' | 'episode'>): Observable<void> {
    const newCharacter: Character = {
      ...character,
      id: this.nextTempId++,
      url: '',
      created: new Date().toISOString(),
      episode: [],
      isTemporary: true
    };
    
    const current = this.temporaryCharacters.value;
    this.temporaryCharacters.next([newCharacter, ...current]);
    return of(undefined);
  }

  updateCharacter(updatedCharacter: Character): Observable<void> {
    // Si es temporal, actualizar en la lista temporal
    if (updatedCharacter.isTemporary) {
      const current = this.temporaryCharacters.value;
      const index = current.findIndex(char => char.id === updatedCharacter.id);
      if (index !== -1) {
        current[index] = updatedCharacter;
        this.temporaryCharacters.next([...current]);
      }
    } else {
      // Para personajes de la API, agregar a temporales con los cambios
      updatedCharacter.isTemporary = true;
      const current = this.temporaryCharacters.value;
      const existingIndex = current.findIndex(char => char.id === updatedCharacter.id);
      
      if (existingIndex !== -1) {
        current[existingIndex] = updatedCharacter;
      } else {
        current.unshift(updatedCharacter);
      }
      
      this.temporaryCharacters.next([...current]);
      // Marcar el original como "eliminado" para no mostrarlo
      this.deletedCharacterIds.add(updatedCharacter.id);
    }
    return of(undefined);
  }

  deleteCharacter(id: number): Observable<void> {
    // Si es temporal, eliminarlo de la lista temporal
    const tempChars = this.temporaryCharacters.value;
    const tempIndex = tempChars.findIndex(char => char.id === id);
    
    if (tempIndex !== -1) {
      tempChars.splice(tempIndex, 1);
      this.temporaryCharacters.next([...tempChars]);
    } else {
      // Si es de la API, marcarlo como eliminado
      this.deletedCharacterIds.add(id);
    }
    return of(undefined);
  }

  resetToOriginal(): void {
    this.temporaryCharacters.next([]);
    this.deletedCharacterIds.clear();
    this.nextTempId = 10000;
  }
}
