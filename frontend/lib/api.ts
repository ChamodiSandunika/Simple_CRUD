import { Book } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// API Keys
const CREATE_API_KEY = 'http://localhost:3000/create';
const UPDATE_API_KEY = 'http://localhost:3000/update/{id}';
const DELETE_API_KEY = 'http://localhost:3000/delete/{id}';

// Fetch all books
export async function getAllBooks(): Promise<Book[]> {
  const response = await fetch(`${API_BASE_URL}/api/books`, {
    cache: 'no-store', // Always fetch fresh data
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  
  const books = await response.json();
  return Array.isArray(books) 
    ? books.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0))
    : [];
}

// Get a single book by ID
export async function getBookById(id: string): Promise<Book> {
  const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Book not found');
  }
  
  return response.json();
}

// Create a new book
export async function createBook(book: Omit<Book, 'id'>): Promise<Book> {
  const response = await fetch(`${API_BASE_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': CREATE_API_KEY,
    },
    body: JSON.stringify(book),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to create book');
  }
  
  return response.json();
}

// Update an existing book
export async function updateBook(id: string, book: Omit<Book, 'id'>): Promise<Book> {
  const response = await fetch(`${API_BASE_URL}/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': UPDATE_API_KEY,
    },
    body: JSON.stringify(book),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to update book');
  }
  
  return response.json();
}

// Delete a book
export async function deleteBook(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'X-API-Key': DELETE_API_KEY,
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to delete book');
  }
}
