import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { DashboardData, HouseholdWithUsers, User } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  Math = Math;
  dashData = signal<DashboardData | null>(null);
  loading = signal(true);
  errorMsg = signal('');
  showCreateHousehold = signal(false);
  showInviteForm = signal(false);
  inviteEmail = signal('');
  inviteLoading = signal(false);
  inviteMsg = signal('');
  householdMembers = signal<User[]>([]);
  showRemoveModal = signal(false);
  showBudgetModal = signal(false);
  savingBudget = signal(false);
  memberToRemove = signal<User | null>(null);
  removingMember = signal(false);
  householdForm: FormGroup;
  budgetForm: FormGroup;
  hasHousehold = computed(() => !!this.authService.currentHousehold());
  isCurrentUserAdmin = computed(() => {
    const user = this.authService.user();
    const currentHousehold = this.authService.currentHousehold();

    if (!user || !currentHousehold || !user.households?.length) {
      return false;
    }

    const household = user.households.find((h) => h.id === currentHousehold.id);
    return household?.pivot?.role === 'admin';
  });

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.householdForm = this.fb.group({
      name: ['', Validators.required],
      daily_budget: ['', [Validators.required, Validators.min(1)]],
    });

    this.budgetForm = this.fb.group({
      monthly_budget: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.authService.loadUser().subscribe({
      next: () => {
        if (this.authService.currentHousehold()) {
          this.loadDashboard();
        } else {
          this.loading.set(false);
          this.showCreateHousehold.set(true);
        }
      },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('Failed to load user data');
      },
    });
  }

  loadDashboard() {
    const hh = this.authService.currentHousehold();
    if (!hh) return;

    this.loading.set(true);
    this.apiService.getDashboard(hh.id).subscribe({
      next: (data) => {
        this.dashData.set(data);
        this.loading.set(false);
        this.loadHouseholdMembers(hh.id);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set('Failed to load dashboard');
      },
    });
  }

  loadHouseholdMembers(householdId: number) {
    this.apiService.getHousehold(householdId).subscribe({
      next: (data) => {
        this.householdMembers.set(data.users || []);
      },
      error: () => {},
    });
  }

  inviteUser() {
    const email = this.inviteEmail().trim();
    const hh = this.authService.currentHousehold();
    if (!email || !hh) return;

    this.inviteLoading.set(true);
    this.inviteMsg.set('');
    this.apiService.inviteToHousehold(hh.id, email).subscribe({
      next: () => {
        this.inviteLoading.set(false);
        this.inviteMsg.set('Invitation sent!');
        this.inviteEmail.set('');
        this.showInviteForm.set(false);
        this.loadHouseholdMembers(hh.id);
      },
      error: (err) => {
        this.inviteLoading.set(false);
        this.inviteMsg.set(err.error?.message || 'Failed to send invitation');
      },
    });
  }

  confirmRemoveMember(member: User) {
    this.memberToRemove.set(member);
    this.showRemoveModal.set(true);
  }

  cancelRemove() {
    this.showRemoveModal.set(false);
    this.memberToRemove.set(null);
  }

  removeMember() {
    const member = this.memberToRemove();
    const hh = this.authService.currentHousehold();
    if (!member || !hh) return;

    this.removingMember.set(true);
    this.apiService.removeMember(hh.id, member.id).subscribe({
      next: () => {
        this.removingMember.set(false);
        this.showRemoveModal.set(false);
        this.memberToRemove.set(null);
        this.loadHouseholdMembers(hh.id);
      },
      error: (err) => {
        this.removingMember.set(false);
        this.errorMsg.set(err.error?.message || 'Failed to remove member');
      },
    });
  }

  createHousehold() {
    if (this.householdForm.invalid) return;

    const { name, daily_budget } = this.householdForm.value;
    this.apiService.createHousehold(name, daily_budget).subscribe({
      next: (hh) => {
        this.authService.setCurrentHousehold(hh);
        this.showCreateHousehold.set(false);
        this.loadDashboard();
      },
      error: () => this.errorMsg.set('Failed to create household'),
    });
  }

  openBudgetModal() {
    if (!this.isCurrentUserAdmin()) {
      this.errorMsg.set('Only household admins can update the budget');
      return;
    }

    const dailyBudget = this.authService.currentHousehold()?.daily_budget ?? this.dashData()?.current_month?.daily_budget;
    const monthlyBudget = dailyBudget ? dailyBudget * this.daysInCurrentMonth() : null;
    this.budgetForm.patchValue({
      monthly_budget: monthlyBudget ? Math.round(monthlyBudget * 100) / 100 : '',
    });
    this.showBudgetModal.set(true);
  }

  closeBudgetModal() {
    this.showBudgetModal.set(false);
    this.savingBudget.set(false);
  }

  daysInCurrentMonth(): number {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }

  calculateMonthlyBudget(): number {
    const daily = Number(this.budgetForm.get('monthly_budget')?.value || 0);
    if (!daily) return 0;
    return daily * this.daysInCurrentMonth();
  }

  saveBudget() {
    if (this.budgetForm.invalid) return;

    if (!this.isCurrentUserAdmin()) {
      this.errorMsg.set('Only household admins can update the budget');
      return;
    }

    const household = this.authService.currentHousehold();
    if (!household) return;

    const daily = Number(this.budgetForm.get('monthly_budget')?.value || 0);
    this.savingBudget.set(true);
    this.apiService.updateHouseholdBudget(household.id, daily).subscribe({
      next: (updatedHousehold) => {
        this.authService.setCurrentHousehold(updatedHousehold);
        this.savingBudget.set(false);
        this.showBudgetModal.set(false);
        this.loadDashboard();
      },
      error: (err) => {
        this.savingBudget.set(false);
        this.errorMsg.set(err.error?.message || 'Failed to update household budget');
      },
    });
  }

  getPercentColor(): string {
    const pct = this.dashData()?.current_month?.percentage_used ?? 0;
    if (pct <= 70) return 'var(--success)';
    if (pct <= 90) return 'var(--accent)';
    return 'var(--danger)';
  }

  getPrevStatus(): string {
    const diff = this.dashData()?.previous_month?.difference ?? 0;
    return diff >= 0 ? 'green' : 'red';
  }

  getMonthName(month: number): string {
    const names = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return names[month] || '';
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
