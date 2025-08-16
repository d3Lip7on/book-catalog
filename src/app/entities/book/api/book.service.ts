import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../shared/api/base-api.service';
import { HttpClient } from '@angular/common/http';
import { IBook, IBookApi, mapBookFromApi } from '../model/book.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  getBooks(searchQuery?: string): Observable<IBook[]> {
    const q = (searchQuery || '').trim().toLowerCase();
    return this.get<IBookApi[]>(`books.json`).pipe(
      map((books) => books.map((book) => mapBookFromApi(book))),
      map((books) => (q ? books.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) : books))
    );
  }

  getBookById(id: number): Observable<IBook | undefined> {
    return this.get<IBookApi[]>(`books.json`).pipe(
      map((books) => books.map((book) => mapBookFromApi(book))),
      map((books) => {
        const found = books.find((b) => b.id === id);
        if (!found) {
          throw new Error(`Book with id ${id} not found`);
        }
        return found;
      })
    );
  }
}
