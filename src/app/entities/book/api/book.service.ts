import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../shared/api/base-api.service';
import { HttpClient } from '@angular/common/http';
import { IBook } from '../model/book.interface';
import { delay, map, Observable } from 'rxjs';
import { IBookApi, ICreateBookApi } from './dto';
import { mapBookFromApi, mapCreateBookToApi } from '../lib/mappers';
import { ICreateBook } from '../model/create-book.interface';

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
      delay(500),
      map((books) => books.map((book) => mapBookFromApi(book))),
      map((books) => (q ? books.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) : books))
    );
  }

  getBookById(id: number): Observable<IBook | undefined> {
    return this.get<IBookApi[]>(`books.json`).pipe(
      delay(500),
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

  createBook(createBookData: ICreateBook): Observable<void> {
    const createBookDataApi: ICreateBookApi = mapCreateBookToApi(createBookData);
    return this.post<void>('books.json', createBookDataApi).pipe(delay(3000));
  }
}
