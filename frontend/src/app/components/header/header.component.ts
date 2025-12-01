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

  // addRegister() {
  //   console.log('add new register');
  // }
  // addNewMonth() {
  //   //este click vai estar dentro do fechamento do mes
  //   console.log('add new month ');
  // }
  // closeMonth() {
  //   console.log('close the month');
  // }
  // openSettings() {
  //   console.log('open settings');
  // }
  // openRapports() {
  //   console.log('open Rapports');
  // }
}
