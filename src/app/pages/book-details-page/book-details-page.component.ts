import { BookDetailsCardComponent, IBook, BookService } from '@/entities/book';
import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterModule, ActivatedRoute } from '@angular/router';
import { tap, catchError } from 'rxjs';

@Component({
  selector: 'app-book-details-page',
  imports: [RouterLink, RouterModule, MatButtonModule, BookDetailsCardComponent],
  templateUrl: './book-details-page.component.html',
})
export class BookDetailsPageComponent implements OnInit {
  book = signal<IBook | null>(null);

  #bookService = inject(BookService);
  #route = inject(ActivatedRoute);
  #destroyRef = inject(DestroyRef);

  #fetchBook(id: number): void {
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
