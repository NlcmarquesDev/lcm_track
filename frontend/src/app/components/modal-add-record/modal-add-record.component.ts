import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-add-record',
  imports: [],
  templateUrl: './modal-add-record.component.html',
  styleUrl: './modal-add-record.component.scss',
})
export class ModalAddRecordComponent {
  @Output() cancel = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit(); // <- avisa o pai
  }
}
