'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Book {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  price: number;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
  id: number;
}

export default function UpdateBookPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const toastIdRef = React.useRef<number>(0);

  const API_URL = 'http://localhost:8080/api/books';

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    
    setToast(null);
    
    const newToastId = ++toastIdRef.current;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setToast({ message, type, id: newToastId });
        toastTimeoutRef.current = setTimeout(() => {
          setToast(null);
          toastTimeoutRef.current = null;
        }, 3000);
      });
    });
  };

  // Fetch book details
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/${id}`);
        if (response.ok) {
          const data = await response.json();
          setBook(data);
        } else {
          showToast('Book not found', 'error');
          setTimeout(() => router.push('/'), 2000);
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        showToast('Failed to load book details', 'error');
        setTimeout(() => router.push('/'), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();

    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      });

      if (response.ok) {
        showToast('Book updated successfully!', 'success');
        setTimeout(() => router.push('/'), 1500);
      } else {
        showToast('Failed to update book', 'error');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      showToast('Error updating book', 'error');
    }
  };

  // Handle input changes
  const handleChange = (field: keyof Book, value: string | number) => {
    if (book) {
      setBook({ ...book, [field]: value });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-600 font-medium text-lg">Book not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      {/* Toast Notification */}
      {toast && (
        <div
          key={toast.id}
          className={`fixed px-8 py-4 rounded-xl shadow-2xl text-white text-lg font-semibold pointer-events-none ${
            toast.type === 'success' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'
          }`}
          style={{
            top: '1rem',
            left: '50%',
            animation: 'slideDown 0.3s ease-out forwards',
            zIndex: 9999
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{toast.type === 'success' ? '✓' : '✕'}</span>
            {toast.message}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-purple-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                ✏️ Edit Book
              </h1>
              <p className="text-gray-600">Update the book details below</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              ← Back
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-amber-600 transition-colors">
                  📖 Title *
                </label>
                <input
                  type="text"
                  required
                  value={book.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 transition-all text-gray-800 bg-white shadow-sm"
                  placeholder="Enter book title"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-amber-600 transition-colors">
                  ✍️ Author *
                </label>
                <input
                  type="text"
                  required
                  value={book.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 transition-all text-gray-800 bg-white shadow-sm"
                  placeholder="Enter author name"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-amber-600 transition-colors">
                  🔢 ISBN *
                </label>
                <input
                  type="text"
                  required
                  value={book.isbn}
                  onChange={(e) => handleChange('isbn', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 transition-all text-gray-800 bg-white shadow-sm"
                  placeholder="Enter ISBN number"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-amber-600 transition-colors">
                  💰 Price *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={book.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 transition-all text-gray-800 bg-white shadow-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-amber-600 transition-colors">
                📝 Description
              </label>
              <textarea
                value={book.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 transition-all text-gray-800 bg-white shadow-sm resize-none"
                placeholder="Enter book description (optional)"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
              >
                💾 Save Changes
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
              >
                ✕ Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Book Preview Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Preview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Title:</span>
              <span className="font-semibold text-gray-800">{book.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Author:</span>
              <span className="font-semibold text-gray-800">{book.author}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ISBN:</span>
              <span className="font-mono text-gray-800">{book.isbn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-bold text-green-600">${book.price.toFixed(2)}</span>
            </div>
            {book.description && (
              <div className="pt-2 border-t">
                <span className="text-gray-600">Description:</span>
                <p className="text-gray-800 mt-1">{book.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
