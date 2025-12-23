import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CardsComponent } from './components/cards/cards.component';
import { TableComponent } from './components/table/table.component';
import { CommonModule } from '@angular/common';
import { BottomModalComponent } from './components/bottom-modal/bottom-modal.component';
import { Card } from './model/card.type';
import { ModalAddRecordComponent } from './components/modal-add-record/modal-add-record.component';
import { ModalSettingsComponent } from './components/modal-settings/modal-settings.component';
import { ModalRapportsComponent } from './components/modal-rapports/modal-rapports.component';
import { ModalCloseMonthComponent } from './components/modal-close-month/modal-close-month.component';
import { CardsRapportComponent } from './components/cards-rapport/cards-rapport.component';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    CardsComponent,
    TableComponent,
    CommonModule,
    BottomModalComponent,
    ModalAddRecordComponent,
    ModalSettingsComponent,
    ModalRapportsComponent,
    ModalCloseMonthComponent,
    CardsRapportComponent,
    HttpClientModule,
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

  cardItems: Array<Card> = [
    { id: 1, description: 'November 2024', totalValue: 2500, saved: 500 },
    { id: 2, description: 'December 2024', totalValue: 3000, saved: 800 },
  ];
}
