import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
  creationAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api.escuelajs.co/api/v1/users';
  private currentUser: User | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          this.currentUser = user;
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  logout(): void {
    this.currentUser = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
  }

  isLoggedIn(): boolean {
    if (this.currentUser) return true;
    
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
        return true;
      }
    }
    return false;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
