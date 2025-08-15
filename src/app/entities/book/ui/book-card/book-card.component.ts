import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IBook } from '../../model/book.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-card',
  imports: [CommonModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCardComponent {
  book = input<IBook | null>();
}
