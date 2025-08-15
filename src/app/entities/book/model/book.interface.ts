export interface IBookApi {
  id: number;
  title: string;
  description: string;
  author: string;
  published_date: string;
  image?: string;
}

export interface IBook {
  id: number;
  title: string;
  description: string;
  author: string;
  publishedDate: Date;
  image?: string;
}

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
