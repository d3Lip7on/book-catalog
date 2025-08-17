import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IBook } from '../../../../entities/book/model/book.interface';
import { BookCardComponent } from '../../../../entities/book/ui/book-card/book-card.component';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-book-list',
  imports: [BookCardComponent, MatGridListModule],
  templateUrl: './book-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListComponent {
  books = input<IBook[]>([]);
}
