import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { BookService } from '../../entities/book/api/book.service';
import { ActivatedRoute } from '@angular/router';
import { IBook } from '../../entities/book/model/book.interface';
import { catchError, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BookDetailsCardComponent } from '../../entities/book/ui/book-details-card/book-details-card.component';

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
