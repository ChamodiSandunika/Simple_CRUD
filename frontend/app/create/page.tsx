'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Book {
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

export default function CreateBookPage() {
  const router = useRouter();
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const toastIdRef = React.useRef<number>(0);

  const [formData, setFormData] = useState<Book>({
    title: '',
    author: '',
    isbn: '',
    description: '',
    price: 0,
  });

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast('Book created successfully!', 'success');
        setTimeout(() => router.push('/'), 1500);
      } else {
        showToast('Failed to create book', 'error');
      }
    } catch (error) {
      console.error('Error creating book:', error);
      showToast('Error creating book', 'error');
    }
  };

  // Handle input changes
  const handleChange = (field: keyof Book, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                ➕ Add New Book
              </h1>
              <p className="text-gray-600">Fill in the details to add a new book to your collection</p>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                  📖 Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-gray-800 bg-white shadow-sm"
                  placeholder="Enter book title"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                  ✍️ Author *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-gray-800 bg-white shadow-sm"
                  placeholder="Enter author name"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                  🔢 ISBN *
                </label>
                <input
                  type="text"
                  required
                  value={formData.isbn}
                  onChange={(e) => handleChange('isbn', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-gray-800 bg-white shadow-sm"
                  placeholder="Enter ISBN number"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                  💰 Price *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price || ''}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-gray-800 bg-white shadow-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                📝 Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-gray-800 bg-white shadow-sm resize-none"
                placeholder="Enter book description (optional)"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
              >
                ✓ Create Book
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

        {/* Preview Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Preview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Title:</span>
              <span className="font-semibold text-gray-800">{formData.title || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Author:</span>
              <span className="font-semibold text-gray-800">{formData.author || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ISBN:</span>
              <span className="font-mono text-gray-800">{formData.isbn || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-bold text-green-600">${formData.price.toFixed(2)}</span>
            </div>
            {formData.description && (
              <div className="pt-2 border-t">
                <span className="text-gray-600">Description:</span>
                <p className="text-gray-800 mt-1">{formData.description}</p>
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
