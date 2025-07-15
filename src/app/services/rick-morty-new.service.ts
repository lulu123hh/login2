import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

    return this.http.get<CharacterResponse>(url);
  }

  getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/${id}`);
  }
}
