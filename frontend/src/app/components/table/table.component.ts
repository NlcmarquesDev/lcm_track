import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayRecord } from '../../model/dayRecord.type';

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  monthRecords: Array<DayRecord> = [
    { id: 1, day: 1, total: 100, difference: 0, rest: 100 },
    { id: 2, day: 2, total: 150, difference: 50, rest: 50 },
    { id: 3, day: 3, total: 120, difference: -30, rest: 80 },
    { id: 4, day: 4, total: 200, difference: 80, rest: 0 },
    { id: 5, day: 5, total: 180, difference: -20, rest: 60 },
    { id: 6, day: 6, total: 220, difference: 40, rest: 0 },
    { id: 7, day: 7, total: 170, difference: -50, rest: 70 },
  ];
}
