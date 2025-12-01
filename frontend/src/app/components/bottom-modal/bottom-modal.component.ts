import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bottom-modal',
  imports: [CommonModule],
  templateUrl: './bottom-modal.component.html',
  styleUrl: './bottom-modal.component.scss',
})
export class BottomModalComponent {
  @Input() isOpen = false;

  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
