import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Household, MonthEntries, MonthlySummary, DashboardData, HouseholdWithUsers } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(private http: HttpClient) {}

  private get apiUrl(): string {
    return environment.apiUrl;
  }

  // Households
  getHouseholds(): Observable<Household[]> {
    return this.http.get<Household[]>(`this.apiUrl/households`);
  }

  getHousehold(householdId: number): Observable<HouseholdWithUsers> {
    return this.http.get<HouseholdWithUsers>(`this.apiUrl/households/${householdId}`);
  }

  createHousehold(name: string, dailyBudget: number): Observable<Household> {
    return this.http.post<Household>(`this.apiUrl/households`, {
      name,
      daily_budget: dailyBudget,
    });
  }

  inviteToHousehold(householdId: number, email: string): Observable<any> {
    return this.http.post(`this.apiUrl/households/${householdId}/invite`, { email });
  }

  removeMember(householdId: number, userId: number): Observable<any> {
    return this.http.delete(`this.apiUrl/households/${householdId}/members/${userId}`);
  }

  // Dashboard
  getDashboard(householdId: number): Observable<DashboardData> {
    const params = new HttpParams().set('household_id', householdId);
    return this.http.get<DashboardData>(`this.apiUrl/dashboard`, { params });
  }

  // Entries
  getEntries(householdId: number, month: number, year: number): Observable<MonthEntries> {
    const params = new HttpParams()
      .set('household_id', householdId)
      .set('month', month)
      .set('year', year);
    return this.http.get<MonthEntries>(`this.apiUrl/entries`, { params });
  }

  saveEntry(householdId: number, date: string, amount: number): Observable<any> {
    return this.http.post(`this.apiUrl/entries`, {
      household_id: householdId,
      date,
      amount,
    });
  }

  // Reports
  getReports(householdId: number): Observable<MonthlySummary[]> {
    const params = new HttpParams().set('household_id', householdId);
    return this.http.get<MonthlySummary[]>(`this.apiUrl/reports`, { params });
  }

  // Close Month
  closeMonth(householdId: number, month: number, year: number): Observable<MonthlySummary> {
    return this.http.post<MonthlySummary>(`this.apiUrl/months/close`, {
      household_id: householdId,
      month,
      year,
    });
  }
}
