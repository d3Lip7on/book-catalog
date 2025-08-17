export interface ICreateBook {
  title: string;
  author: string;
  publishedDate: Date | null;
  description?: string;
  image?: string | null;
}
