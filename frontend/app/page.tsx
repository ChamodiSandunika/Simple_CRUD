import { getAllBooks } from "@/lib/api"
import { BooksTable } from "@/components/books-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Plus } from "lucide-react"
import Link from "next/link"
import { Book } from "@/lib/types"

export default async function Home() {
  let books: Book[] = [];
  let error = null;

  try {
    books = await getAllBooks();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load books";
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-2 border-indigo-200 shadow-lg bg-gradient-to-r from-white to-blue-50">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">Book Management System</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-600">
                  📚 Manage your book collection with ease • <span className="font-semibold text-indigo-600">{books.length}</span> books total
                </CardDescription>
              </div>
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
                <Link href="/create">
                  <Plus className="h-5 w-5" />
                  Add New Book
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="border-2 border-red-300 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600 text-center font-semibold">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Books Table */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <span className="text-3xl">📖</span> All Books
          </h2>
          <BooksTable books={books} />
        </div>
      </div>
    </div>
  )
}
