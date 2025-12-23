import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-modal-settings',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-settings.component.html',
  styleUrl: './modal-settings.component.scss',
})
export class ModalSettingsComponent implements OnInit {
  @Output() cancel = new EventEmitter<void>();

  settingsForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      monthly_budget: [null, [Validators.required, Validators.min(0)]],
      month_start_day: [
        1,
        [Validators.required, Validators.min(1), Validators.max(28)],
      ],
      currency_id: [null, Validators.required],
    });
    // carregar valores existentes
    this.settingsService.getSettings().subscribe((data: any) => {
      if (data) {
        this.settingsForm.patchValue(data);
      }
    });
  }

  save(): void {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    this.settingsService.saveSettings(this.settingsForm.value).subscribe({
      next: () => alert('Definições guardadas com sucesso'),
      error: (err) => console.error(err),
    });
  }

  onCancel() {
    this.cancel.emit(); // <- avisa o pai
  }
}
