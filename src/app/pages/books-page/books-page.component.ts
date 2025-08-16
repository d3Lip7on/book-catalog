import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IBook } from '../../entities/book/model/book.interface';
import { BookService } from '../../entities/book/api/book.service';
import { catchError, debounceTime, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BookListComponent } from '../../widgets/book-list/ui/book-list/book-list.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-books-page',
  imports: [BookListComponent, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './books-page.component.html',
  styleUrl: './books-page.component.scss',
})
export class BooksPageComponent implements OnInit {
  books = signal<IBook[]>([]);
  searchQuery = new FormControl('');

  #bookService = inject(BookService);
  #destroyRef = inject(DestroyRef);

  #subscribeToSearchQuery() {
    this.searchQuery.valueChanges
      .pipe(
        debounceTime(300),
        tap((query) => {
          this.#fetchBooks(query ?? undefined);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  #fetchBooks(query?: string) {
    this.#bookService
      .getBooks(query)
      .pipe(
        tap((books) => {
          this.books.set(books);
        }),
        catchError((error) => {
          alert('Error fetching books: ' + error);
          return [];
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.#fetchBooks();
    this.#subscribeToSearchQuery();
  }
}
