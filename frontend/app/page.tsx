'use client';

import { useState, useEffect } from 'react';

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
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
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
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-lg shadow-2xl text-white z-50 transition-opacity text-lg font-medium ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Book Management System</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {showForm ? 'Cancel' : 'Add New Book'}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ISBN *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {editingBook ? 'Update Book' : 'Create Book'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Books List */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">All Books</h2>
            {isLoading ? (
              <div className="text-center py-8 text-gray-600">Loading books...</div>
            ) : books.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No books found. Click "Add New Book" to create one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Title</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Author</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">ISBN</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Price</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 text-gray-800">{book.id}</td>
                        <td className="border border-gray-300 px-4 py-2 text-gray-800">{book.title}</td>
                        <td className="border border-gray-300 px-4 py-2 text-gray-800">{book.author}</td>
                        <td className="border border-gray-300 px-4 py-2 text-gray-800">{book.isbn}</td>
                        <td className="border border-gray-300 px-4 py-2 text-gray-800">${book.price.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-gray-800 max-w-xs truncate">
                          {book.description}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(book)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(book.id!)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors text-sm"
                            >
                              Delete
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
