import { IBook, BookService } from '@/entities/book';
import { BookCreateDialogComponent } from '@/features/book-create';
import { EDialogCloseStatus } from '@/shared';
import { BookListComponent } from '@/widgets/book-list';
import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { tap, debounceTime, catchError, finalize } from 'rxjs';

@Component({
  selector: 'app-books-page',
  imports: [
    BookListComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './books-page.component.html',
})
export class BooksPageComponent implements OnInit {
  books = signal<IBook[]>([]);
  isLoading = signal<boolean>(false);
  searchQuery = new FormControl('');

  #bookService = inject(BookService);
  #dialog = inject(MatDialog);
  #destroyRef = inject(DestroyRef);

  onCreateButtonClick() {
    const createBookDialogRef = this.#dialog.open(BookCreateDialogComponent, {
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',

      width: 'min(96vw, 450px)',

      height: 'auto',
      maxHeight: '85dvh',
    });

    createBookDialogRef
      .afterClosed()
      .pipe(
        tap((res: EDialogCloseStatus) => {
          switch (res) {
            case EDialogCloseStatus.Success:
              this.#fetchBooks();
              break;
            case EDialogCloseStatus.Cancel:
              break;
            case EDialogCloseStatus.Error:
              alert('An error occurred while creating the book.');
              break;
            default:
          }
        })
      )
      .subscribe();
  }

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
    this.isLoading.set(true);
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
        finalize(() => {
          this.isLoading.set(false);
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
