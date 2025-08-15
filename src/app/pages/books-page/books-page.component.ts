import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { IBook } from '../../entities/book/model/book.interface';
import { BookService } from '../../entities/book/api/book.service';
import { catchError, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BookListComponent } from '../../widgets/book-list/ui/book-list/book-list.component';

@Component({
  selector: 'app-books-page',
  imports: [BookListComponent],
  templateUrl: './books-page.component.html',
  styleUrl: './books-page.component.scss',
})
export class BooksPageComponent implements OnInit {
  books = signal<IBook[]>([]);

  #bookService = inject(BookService);
  #destroyRef = inject(DestroyRef);

  #fetchBooks() {
    this.#bookService
      .getBooks()
      .pipe(
        tap((books) => {
          this.books.set(books);
        }),
        catchError((error) => {
          alert('Error fetching books');
          return [];
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.#fetchBooks();
  }
}
