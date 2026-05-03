import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { DailyEntry, MonthlySummary } from '../../core/models';

@Component({
  selector: 'app-daily-table',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './daily-table.component.html',
  styleUrl: './daily-table.component.css',
})
export class DailyTableComponent implements OnInit {
  entries = signal<DailyEntry[]>([]);
  isClosed = signal(false);
  loading = signal(true);
  saving = signal(false);
  errorMsg = signal('');
  successMsg = signal('');
  showEntryForm = signal(false);
  closing = signal(false);

  currentMonth = signal(new Date().getMonth() + 1);
  currentYear = signal(new Date().getFullYear());

  entryForm: FormGroup;

  // Previous month summary
  prevSummary = signal<any>(null);
  prevLoading = signal(false);

  todayStr = new Date().toISOString().split('T')[0];

  Math = Math;

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.entryForm = this.fb.group({
      date: [this.todayStr, Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.loadEntries();
    this.loadPrevMonth();
  }

  loadEntries() {
    const hh = this.authService.currentHousehold();
    if (!hh) return;

    this.loading.set(true);
    this.apiService.getEntries(hh.id, this.currentMonth(), this.currentYear()).subscribe({
      next: (data) => {
        this.entries.set(data.entries);
        this.isClosed.set(data.is_closed);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('Failed to load entries');
      },
    });
  }

  loadPrevMonth() {
    const hh = this.authService.currentHousehold();
    if (!hh) return;

    let prevMonth = this.currentMonth() - 1;
    let prevYear = this.currentYear();
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear--;
    }

    this.prevLoading.set(true);
    this.apiService.getDashboard(hh.id).subscribe({
      next: (data) => {
        this.prevSummary.set(data.previous_month);
        this.prevLoading.set(false);
      },
      error: () => this.prevLoading.set(false),
    });
  }

  saveEntry() {
    if (this.entryForm.invalid) return;

    const hh = this.authService.currentHousehold();
    if (!hh) return;

    this.saving.set(true);
    this.errorMsg.set('');

    const { date, amount } = this.entryForm.value;
    this.apiService.saveEntry(hh.id, date, amount).subscribe({
      next: () => {
        this.saving.set(false);
        this.showEntryForm.set(false);
        this.successMsg.set('Entry saved!');
        setTimeout(() => this.successMsg.set(''), 2000);
        this.entryForm.patchValue({ amount: '' });
        this.loadEntries();
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMsg.set(err.error?.message || 'Failed to save entry');
      },
    });
  }

  closeMonth() {
    const hh = this.authService.currentHousehold();
    if (!hh) return;

    if (!confirm('Are you sure you want to close this month? This action cannot be undone.')) return;

    this.closing.set(true);
    this.apiService.closeMonth(hh.id, this.currentMonth(), this.currentYear()).subscribe({
      next: () => {
        this.closing.set(false);
        this.isClosed.set(true);
        this.successMsg.set('Month closed successfully!');
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: (err) => {
        this.closing.set(false);
        this.errorMsg.set(err.error?.message || 'Failed to close month');
      },
    });
  }

  navigateMonth(delta: number) {
    let m = this.currentMonth() + delta;
    let y = this.currentYear();
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    this.currentMonth.set(m);
    this.currentYear.set(y);
    this.loadEntries();
  }

  isToday(date: string): boolean {
    return date === this.todayStr;
  }

  isFuture(date: string): boolean {
    return date > this.todayStr;
  }

  getMonthName(month: number): string {
    const names = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return names[month] || '';
  }

  getDayOfWeek(date: string): string {
    const d = new Date(date + 'T00:00:00');
    return d.toLocaleDateString('en', { weekday: 'short' });
  }

  getDayNum(date: string): number {
    return parseInt(date.split('-')[2], 10);
  }

  prefillDate(date: string) {
    this.entryForm.patchValue({ date });
    this.showEntryForm.set(true);
  }
}
