import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  addRegister() {
    console.log('add new register');
  }
  addNewMonth() {
    //este click vai estar dentro do fechamento do mes
    console.log('add new month ');
  }
  closeMonth() {
    console.log('close the month');
  }
  openSettings() {
    console.log('open settings');
  }
  openRapports() {
    console.log('open Rapports');
  }
}
