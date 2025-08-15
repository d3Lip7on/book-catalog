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

  getBooks(): Observable<IBook[]> {
    return this.get<IBookApi[]>(`books.json`).pipe(map((books) => books.map((book) => mapBookFromApi(book))));
  }
}
