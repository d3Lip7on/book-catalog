export interface IBook {
  id: number;
  title: string;
  description?: string;
  author: string;
  publishedDate: Date;
  image?: string;
}
