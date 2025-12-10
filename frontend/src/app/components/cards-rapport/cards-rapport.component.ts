import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cards-rapport',
  imports: [CommonModule],
  templateUrl: './cards-rapport.component.html',
  styleUrl: './cards-rapport.component.scss',
})
export class CardsRapportComponent {
  title = input('november');
  description = input('');
  total = input(0);
  isCumultative = input(false);
}
