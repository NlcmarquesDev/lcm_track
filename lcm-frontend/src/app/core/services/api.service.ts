import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Household, MonthEntries, MonthlySummary, DashboardData, HouseholdWithUsers } from '../models';

const API_URL = 'http://localhost:8000/api';

@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(private http: HttpClient) {}

  // Households
  getHouseholds(): Observable<Household[]> {
    return this.http.get<Household[]>(`${API_URL}/households`);
  }

  getHousehold(householdId: number): Observable<HouseholdWithUsers> {
    return this.http.get<HouseholdWithUsers>(`${API_URL}/households/${householdId}`);
  }

  createHousehold(name: string, dailyBudget: number): Observable<Household> {
    return this.http.post<Household>(`${API_URL}/households`, {
      name,
      daily_budget: dailyBudget,
    });
  }

  inviteToHousehold(householdId: number, email: string): Observable<any> {
    return this.http.post(`${API_URL}/households/${householdId}/invite`, { email });
  }

  removeMember(householdId: number, userId: number): Observable<any> {
    return this.http.delete(`${API_URL}/households/${householdId}/members/${userId}`);
  }

  // Dashboard
  getDashboard(householdId: number): Observable<DashboardData> {
    const params = new HttpParams().set('household_id', householdId);
    return this.http.get<DashboardData>(`${API_URL}/dashboard`, { params });
  }

  // Entries
  getEntries(householdId: number, month: number, year: number): Observable<MonthEntries> {
    const params = new HttpParams()
      .set('household_id', householdId)
      .set('month', month)
      .set('year', year);
    return this.http.get<MonthEntries>(`${API_URL}/entries`, { params });
  }

  saveEntry(householdId: number, date: string, amount: number): Observable<any> {
    return this.http.post(`${API_URL}/entries`, {
      household_id: householdId,
      date,
      amount,
    });
  }

  // Reports
  getReports(householdId: number): Observable<MonthlySummary[]> {
    const params = new HttpParams().set('household_id', householdId);
    return this.http.get<MonthlySummary[]>(`${API_URL}/reports`, { params });
  }

  // Close Month
  closeMonth(householdId: number, month: number, year: number): Observable<MonthlySummary> {
    return this.http.post<MonthlySummary>(`${API_URL}/months/close`, {
      household_id: householdId,
      month,
      year,
    });
  }
}
