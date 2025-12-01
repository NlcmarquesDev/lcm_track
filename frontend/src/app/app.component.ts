import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CardsComponent } from './components/cards/cards.component';
import { TableComponent } from './components/table/table.component';
import { CommonModule } from '@angular/common';
import { BottomModalComponent } from './components/bottom-modal/bottom-modal.component';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    CardsComponent,
    TableComponent,
    CommonModule,
    BottomModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isModalOpen = false;
  modalType: string | null = null;

  openModal(type: string) {
    console.log('aqui');
    this.modalType = type;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
