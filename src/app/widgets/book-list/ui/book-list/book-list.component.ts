import { Component, input } from '@angular/core';
import { IBook } from '../../../../entities/book/model/book.interface';
import { BookCardComponent } from '../../../../entities/book/ui/book-card/book-card.component';

@Component({
  selector: 'app-book-list',
  imports: [BookCardComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent {
  books = input<IBook[]>([]);
}
