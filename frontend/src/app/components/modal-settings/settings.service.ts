import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private apiUrl = 'http://localhost:8000/api/v1';

  constructor(private apiService: ApiService) {}

  getSettings(): Observable<any> {
    // return this.apiService.http.get(`${this.apiUrl}/user-settings`, {
    //   headers: this.apiService.getHeaders(),
    // });
    return of({
      monthly_budget: 150,
      month_start_day: 1,
      currency_id: 2,
    });
  }

  saveSettings(data: any): Observable<any> {
    // return this.apiService.http.post(
    //   `${this.apiUrl}/user-settings`,
    //   userSettings,
    //   { headers: this.apiService.getHeaders() }
    // );
    console.log('Dados enviados (mock):', data);
    // Apenas retorna o mesmo dado para teste
    return of(data);
  }
}
