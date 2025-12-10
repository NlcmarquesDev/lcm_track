import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-settings',
  imports: [],
  templateUrl: './modal-settings.component.html',
  styleUrl: './modal-settings.component.scss',
})
export class ModalSettingsComponent {
  @Output() cancel = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit(); // <- avisa o pai
  }
}
