import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IBook } from '../../entities/book/model/book.interface';
import { BookService } from '../../entities/book/api/book.service';
import { catchError, debounceTime, finalize, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BookListComponent } from '../../widgets/book-list/ui/book-list/book-list.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { BookCreateDialogComponent } from '../../features/book-create/ui/book-create-dialog/book-create-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { EDialogCloseStatus } from '../../shared/lib/dialog/dialog.types';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
