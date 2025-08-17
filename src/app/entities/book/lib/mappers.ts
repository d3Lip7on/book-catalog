import { IBookApi, ICreateBookApi } from '../api/dto';
import { IBook } from '../model/book.interface';
import { ICreateBook } from '../model/create-book.interface';

export function mapBookFromApi(book: IBookApi): IBook {
  return {
    id: book.id,
    title: book.title,
    description: book.description,
    author: book.author,
    publishedDate: new Date(book.published_date),
    image: book.image,
  };
}

export function mapCreateBookToApi(book: ICreateBook): ICreateBookApi {
  return {
    title: book.title,
    author: book.author,
    published_date: book.publishedDate ? book.publishedDate.toISOString() : null,
    description: book.description,
    image: book.image,
  };
}
