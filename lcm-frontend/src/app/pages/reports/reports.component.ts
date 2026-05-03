import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { MonthlySummary } from '../../core/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  Math = Math;
  reports = signal<MonthlySummary[]>([]);
  loading = signal(true);
  errorMsg = signal('');

  constructor(
    public authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    const hh = this.authService.currentHousehold();
    if (!hh) return;

    this.loading.set(true);
    this.apiService.getReports(hh.id).subscribe({
      next: (data) => {
        this.reports.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('Failed to load reports');
      },
    });
  }

  getMonthName(month: number): string {
    const names = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return names[month] || '';
  }

  getStatusColor(pct: number): string {
    if (pct <= 70) return 'var(--success)';
    if (pct <= 90) return 'var(--accent)';
    return 'var(--danger)';
  }
}