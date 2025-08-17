import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BookCardComponent, IBook } from '@entities/book';

@Component({
  selector: 'app-book-list',
  imports: [BookCardComponent],
  templateUrl: './book-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListComponent {
  books = input<IBook[]>([]);
}
