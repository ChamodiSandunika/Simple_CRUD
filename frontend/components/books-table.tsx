"use client"

import { Book } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Edit, Trash2 } from "lucide-react"

interface BooksTableProps {
  books: Book[]
}

export function BooksTable({ books }: BooksTableProps) {
  if (books.length === 0) {
    return (
      <Card className="p-12 border-2 border-dashed border-indigo-300 bg-gradient-to-br from-white to-indigo-50">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="h-12 w-12 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">No books found</h3>
            <p className="text-base text-gray-600 mt-2">
              Get started by adding your first book to the collection
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Link href="/create">📚 Add Your First Book</Link>
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-indigo-200 shadow-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <th className="h-14 px-6 text-left align-middle font-bold text-sm uppercase tracking-wider">
                  ID
                </th>
                <th className="h-14 px-6 text-left align-middle font-bold text-sm uppercase tracking-wider">
                  📚 Title
                </th>
                <th className="h-14 px-6 text-left align-middle font-bold text-sm uppercase tracking-wider">
                  ✍️ Author
                </th>
                <th className="h-14 px-6 text-left align-middle font-bold text-sm uppercase tracking-wider">
                  🔢 ISBN
                </th>
                <th className="h-14 px-6 text-left align-middle font-bold text-sm uppercase tracking-wider">
                  💰 Price
                </th>
                <th className="h-14 px-6 text-left align-middle font-bold text-sm uppercase tracking-wider max-w-xs">
                  📝 Description
                </th>
                <th className="h-14 px-6 text-center align-middle font-bold text-sm uppercase tracking-wider">
                  ⚡ Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book.id} className={`border-b transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="p-4 align-middle font-semibold text-indigo-600">
                    #{book.id}
                  </td>
                  <td className="p-4 align-middle font-bold text-gray-800">
                    {book.title}
                  </td>
                  <td className="p-4 align-middle text-gray-700 font-medium">
                    {book.author}
                  </td>
                  <td className="p-4 align-middle font-mono text-sm text-blue-600 font-semibold">
                    {book.isbn}
                  </td>
                  <td className="p-4 align-middle">
                    <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                      ${book.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4 align-middle max-w-xs">
                    <div className="truncate text-sm text-gray-600" title={book.description}>
                      {book.description || <span className="italic text-gray-400">No description</span>}
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" size="sm" asChild className="border-2 border-amber-400 text-amber-700 hover:bg-amber-50 hover:text-amber-800 font-semibold">
                        <Link href={`/update/${book.id}`}>
                          <Edit className="h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm" asChild className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 font-semibold">
                        <Link href={`/delete/${book.id}`}>
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
