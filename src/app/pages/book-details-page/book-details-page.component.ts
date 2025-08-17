import { BookDetailsCardComponent, IBook, BookService } from '@/entities/book';
import { Component, OnInit, signal, inject, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink, RouterModule, ActivatedRoute } from '@angular/router';
import { tap, catchError, finalize } from 'rxjs';

@Component({
  selector: 'app-book-details-page',
  imports: [RouterLink, RouterModule, MatButtonModule, BookDetailsCardComponent, MatProgressSpinnerModule],
  templateUrl: './book-details-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsPageComponent implements OnInit {
  book = signal<IBook | null>(null);
  isLoading = signal<boolean>(false);

  #bookService = inject(BookService);
  #route = inject(ActivatedRoute);
  #destroyRef = inject(DestroyRef);

  #fetchBook(id: number): void {
    this.isLoading.set(true);
    this.#bookService
      .getBookById(id)
      .pipe(
        tap((book) => {
          this.book.set(book || null);
        }),
        catchError((error) => {
          alert(error);
          return [];
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  ngOnInit(): void {
    const idStr = this.#route.snapshot.paramMap.get('id');
    const id = idStr ? parseInt(idStr) : null;
    if (id !== null) {
      this.#fetchBook(id);
    }
  }
}
