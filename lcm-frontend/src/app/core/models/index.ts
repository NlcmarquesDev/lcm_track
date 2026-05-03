export interface User {
  id: number;
  name: string;
  email: string;
  households?: Household[];
}

export interface Household {
  id: number;
  name: string;
  daily_budget: number;
  pivot?: { role: string };
}

export interface HouseholdWithUsers extends Household {
  users: User[];
}

export interface DailyEntry {
  date: string;
  spent: number;
  budget: number;
  difference: number;
  cumulative: number;
  status: 'green' | 'red';
}

export interface MonthEntries {
  entries: DailyEntry[];
  is_closed: boolean;
}

export interface MonthlySummary {
  id?: number;
  household_id: number;
  month: number;
  year: number;
  total_spent: number;
  total_budget: number;
  difference: number;
  percentage: number;
  is_closed?: boolean;
}

export interface CurrentMonthStats {
  month: number;
  year: number;
  total_spent: number;
  total_budget: number;
  budget_so_far: number;
  remaining: number;
  percentage_used: number;
  daily_budget: number;
}

export interface DashboardData {
  current_month: CurrentMonthStats;
  previous_month: MonthlySummary;
}

export interface AuthResponse {
  user: User;
  token: string;
}
