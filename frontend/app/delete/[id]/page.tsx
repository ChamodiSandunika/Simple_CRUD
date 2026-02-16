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

export default function DeleteDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const id = params?.id;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const toastIdRef = React.useRef<number>(0);

  const API = 'http://localhost:8080/api/books';

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

  useEffect(() => {
    if (!id) return;
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) {
          showToast('Book not found', 'error');
          setTimeout(() => router.push('/'), 2000);
          return;
        }
        const data = await res.json();
        setBook(data);
      } catch (err) {
        showToast('Error fetching book', 'error');
        setTimeout(() => router.push('/'), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();

    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [id]);

  const doDelete = async () => {
    if (!id) return;
    try {
      const res = await fetch(`${API}/delete/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Book deleted successfully!', 'success');
        setTimeout(() => router.push('/'), 1500);
        return;
      }
      showToast('Failed to delete book', 'error');
    } catch (err) {
      showToast('Error deleting book', 'error');
    }
  };

  if (loading) {
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
          <button
            onClick={() => router.push('/')}
            className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ← Back to Home
          </button>
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
                🗑️ Delete Book
              </h1>
              <p className="text-gray-600">Review the book details before deleting</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              ← Back
            </button>
          </div>

          {/* Book Details Card */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 mb-6 border-2 border-red-200">
            <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📖</span>
              Book Details
            </h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm font-semibold text-gray-500 mb-1">📖 Title</div>
                <div className="text-lg font-bold text-gray-800">{book.title}</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm font-semibold text-gray-500 mb-1">✍️ Author</div>
                <div className="text-lg text-gray-800">{book.author}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm font-semibold text-gray-500 mb-1">🔢 ISBN</div>
                  <div className="text-gray-800 font-mono">{book.isbn}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm font-semibold text-gray-500 mb-1">💰 Price</div>
                  <div className="text-xl font-bold text-green-600">${book.price.toFixed(2)}</div>
                </div>
              </div>
              {book.description && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm font-semibold text-gray-500 mb-1">📝 Description</div>
                  <div className="text-gray-700">{book.description}</div>
                </div>
              )}
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <p className="font-bold text-red-900">Warning: This action cannot be undone!</p>
                <p className="text-sm text-red-700">This book will be permanently removed from the database.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
            >
              ✕ Cancel
            </button>
            <button
              onClick={() => setConfirming(true)}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
            >
              🗑️ Delete Book
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirming && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-[scaleIn_0.3s_ease-out]">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <span className="text-4xl">🗑️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Book?</h3>
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this book?
              </p>
              <p className="text-lg font-semibold text-red-600 mb-6">
                "{book.title}"
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  ✕ Cancel
                </button>
                <button
                  onClick={doDelete}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
