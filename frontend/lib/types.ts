export interface Book {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  price: number;
}

export interface ApiError {
  message: string;
  status: number;
}
