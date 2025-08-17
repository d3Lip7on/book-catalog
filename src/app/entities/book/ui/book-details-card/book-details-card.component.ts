import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IBook } from '../../model/book.interface';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-details-card',
  imports: [MatCardModule, CommonModule],
  templateUrl: './book-details-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsCardComponent {
  book = input<IBook | null>();
}
