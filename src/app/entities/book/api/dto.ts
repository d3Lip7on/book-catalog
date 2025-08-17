export interface IBookApi {
  id: number;
  title: string;
  description?: string;
  author: string;
  published_date: string;
  image?: string;
}

export interface ICreateBookApi {
  title: string;
  author: string;
  published_date: string | null;
  description?: string;
  image?: string | null;
}
