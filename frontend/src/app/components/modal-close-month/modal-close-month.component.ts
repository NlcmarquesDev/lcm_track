import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-close-month',
  imports: [],
  templateUrl: './modal-close-month.component.html',
  styleUrl: './modal-close-month.component.scss',
})
export class ModalCloseMonthComponent {
  @Output() cancel = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit(); // <- avisa o pai
  }
}
