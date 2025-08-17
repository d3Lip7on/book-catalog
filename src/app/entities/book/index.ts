export { BookService } from './api/book.service';
export type { IBookApi, ICreateBookApi } from './api/dto';
export type { IBook } from './model/book.interface';
export { mapBookFromApi, mapCreateBookToApi } from './lib/mappers';
export { BookCardComponent } from './ui/book-card/book-card.component';
export { BookDetailsCardComponent } from './ui/book-details-card/book-details-card.component';
