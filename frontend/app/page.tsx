'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Book {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  price: number;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const API_URL = 'http://localhost:8080/api/books';

  // Fetch all books
  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-purple-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                📚 Book Management System
              </h1>
              <p className="text-gray-600">Manage your book collection with ease</p>
            </div>
            <button
              onClick={() => router.push('/create')}
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            >
              + Add New Book
            </button>
          </div>
          {/* Books List */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              📚 All Books <span className="text-sm font-normal text-gray-500">({books.length} total)</span>
            </h2>
            {isLoading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading books...</p>
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-gray-600 font-medium text-lg">No books found</p>
                <p className="text-gray-500 mt-2">Click "Add New Book" to create your first book</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                      <th className="px-6 py-4 text-left font-semibold">ID</th>
                      <th className="px-6 py-4 text-left font-semibold">Title</th>
                      <th className="px-6 py-4 text-left font-semibold">Author</th>
                      <th className="px-6 py-4 text-left font-semibold">ISBN</th>
                      <th className="px-6 py-4 text-left font-semibold">Price</th>
                      <th className="px-6 py-4 text-left font-semibold">Description</th>
                      <th className="px-6 py-4 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {books.map((book, index) => (
                      <tr 
                        key={book.id} 
                        className={`transition-all duration-200 hover:bg-indigo-50 ${
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        <td className="px-6 py-4 text-gray-700 font-medium border-b border-gray-200">{book.id}</td>
                        <td className="px-6 py-4 text-gray-800 font-semibold border-b border-gray-200">{book.title}</td>
                        <td className="px-6 py-4 text-gray-700 border-b border-gray-200">{book.author}</td>
                        <td className="px-6 py-4 text-gray-600 font-mono text-sm border-b border-gray-200">{book.isbn}</td>
                        <td className="px-6 py-4 text-green-600 font-bold border-b border-gray-200">${book.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-gray-600 border-b border-gray-200">
                          <div className="max-w-xs truncate" title={book.description}>
                            {book.description || <span className="text-gray-400 italic">No description</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => router.push(`/update/${book.id}`)}
                              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium shadow-md text-sm"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => router.push(`/delete/${book.id}`)}
                              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium shadow-md text-sm"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
