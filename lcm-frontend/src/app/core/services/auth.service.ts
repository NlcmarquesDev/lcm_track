import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { User, AuthResponse, Household } from '../models';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);
  private _currentHousehold = signal<Household | null>(null);

  user = this._user.asReadonly();
  token = this._token.asReadonly();
  currentHousehold = this._currentHousehold.asReadonly();
  isLoggedIn = computed(() => !!this._token());

  constructor(private http: HttpClient, private router: Router) {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedHousehold = localStorage.getItem('currentHousehold');
    if (storedToken) {
      this._token.set(storedToken);
    }
    if (storedUser) {
      try { this._user.set(JSON.parse(storedUser)); } catch {}
    }
    if (storedHousehold) {
      try { this._currentHousehold.set(JSON.parse(storedHousehold)); } catch {}
    }
  }

  register(name: string, email: string, password: string) {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register`, { name, email, password })
      .pipe(tap(res => this.handleAuth(res)));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, { email, password })
      .pipe(tap(res => this.handleAuth(res)));
  }

  logout() {
    return this.http.post(`${API_URL}/auth/logout`, {}).pipe(
      tap(() => {
        this.clearAuth();
        this.router.navigate(['/auth']);
      })
    );
  }

  loadUser() {
    return this.http.get<User>(`${API_URL}/user`).pipe(
      tap(user => {
        this._user.set(user);
        localStorage.setItem('user', JSON.stringify(user));
        const households = user.households ?? [];
        const current = this._currentHousehold();

        if (!households.length) {
          this._currentHousehold.set(null);
          localStorage.removeItem('currentHousehold');
          return;
        }

        // Keep selected household only if it still belongs to the user in this environment.
        if (current && households.some(h => h.id === current.id)) {
          return;
        }

        this.setCurrentHousehold(households[0]);
      })
    );
  }

  setCurrentHousehold(household: Household) {
    this._currentHousehold.set(household);
    localStorage.setItem('currentHousehold', JSON.stringify(household));
  }

  private handleAuth(res: AuthResponse) {
    this._user.set(res.user);
    this._token.set(res.token);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
  }

  private clearAuth() {
    this._user.set(null);
    this._token.set(null);
    this._currentHousehold.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentHousehold');
  }
}
