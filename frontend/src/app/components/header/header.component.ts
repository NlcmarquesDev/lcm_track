import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() openModal = new EventEmitter<string>();

  open(type: string) {
    this.openModal.emit(type);
  }
}
