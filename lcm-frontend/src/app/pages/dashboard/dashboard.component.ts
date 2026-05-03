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
  memberToRemove = signal<User | null>(null);
  removingMember = signal(false);
  householdForm: FormGroup;
  hasHousehold = computed(() => !!this.authService.currentHousehold());

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
