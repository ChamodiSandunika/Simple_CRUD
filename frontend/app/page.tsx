'use client';

import React, { useState, useEffect } from 'react';

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

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; bookId: number | null; bookTitle: string }>({
    show: false,
    bookId: null,
    bookTitle: ''
  });
  const [formData, setFormData] = useState<Book>({
    title: '',
    author: '',
    isbn: '',
    description: '',
    price: 0,
  });

  const API_URL = 'http://localhost:8080/api/books';
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const toastIdRef = React.useRef<number>(0);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    // Clear any existing timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    
    // Clear toast immediately
    setToast(null);
    
    // Set new toast with unique ID after a brief delay
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

  // Fetch all books
  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      showToast('Failed to fetch books. Make sure the backend is running.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    
    // Cleanup timeout on unmount
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Create or Update book
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBook ? `${API_URL}/${editingBook.id}` : API_URL;
      const method = editingBook ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchBooks();
        resetForm();
        showToast(editingBook ? 'Book updated successfully!' : 'Book created successfully!', 'success');
      }
    } catch (error) {
      console.error('Error saving book:', error);
      showToast('Failed to save book', 'error');
    }
  };

  // Delete book
  const handleDelete = async (id: number, title: string) => {
    setDeleteConfirm({ show: true, bookId: id, bookTitle: title });
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (deleteConfirm.bookId) {
      try {
        const response = await fetch(`${API_URL}/${deleteConfirm.bookId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchBooks();
          showToast('Book deleted successfully!', 'success');
        }
      } catch (error) {
        console.error('Error deleting book:', error);
        showToast('Failed to delete book', 'error');
      }
    }
    setDeleteConfirm({ show: false, bookId: null, bookTitle: '' });
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm({ show: false, bookId: null, bookTitle: '' });
  };

  // Edit book
  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData(book);
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      description: '',
      price: 0,
    });
    setEditingBook(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      {/* Toast Notification with Animation */}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
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
              <p className="text-lg font-semibold text-indigo-600 mb-6">
                "{deleteConfirm.bookTitle}"
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  ✕ Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              onClick={() => setShowForm(!showForm)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                showForm
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white'
              }`}
            >
              {showForm ? '✕ Cancel' : '+ Add New Book'}
            </button>
          </div>

          {/* Form with Animation */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl mb-6 border border-indigo-200 shadow-inner animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-2xl font-bold mb-6 text-indigo-900 flex items-center gap-2">
                {editingBook ? '✏️ Edit Book' : '➕ Add New Book'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                    📖 Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
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
                    step="0.01"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-gray-800 bg-white shadow-sm"
                    placeholder="0.00"
                  />
                </div>
                <div className="md:col-span-2 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                    📝 Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-gray-800 bg-white shadow-sm resize-none"
                    placeholder="Enter book description (optional)"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 md:flex-none bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                >
                  {editingBook ? '💾 Update Book' : '✓ Create Book'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 md:flex-none bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          )}

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
                              onClick={() => handleEdit(book)}
                              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium shadow-md text-sm"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(book.id!, book.title)}
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
