"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { BookForm } from "@/components/book-form"
import { getBookById, updateBook } from "@/lib/api"
import { Book } from "@/lib/types"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"

export default function UpdateBookPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBook() {
      try {
        const data = await getBookById(id)
        setBook(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load book"
        setError(message)
        toast.error(`❌ ${message}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [id])

  const handleSubmit = async (data: Omit<Book, "id">) => {
    try {
      await updateBook(id, data)
      toast.success("✅ Book updated successfully!")
      router.push("/")
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update book"
      toast.error(`❌ ${message}`)
      throw err
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-indigo-200 shadow-lg">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-700 font-semibold">Loading book details...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-red-400 bg-red-50 shadow-lg">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <p className="text-red-600 font-semibold text-lg">{error || "Book not found"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <BookForm
          initialData={book}
          onSubmit={handleSubmit}
          submitLabel="Update Book"
          title="Update Book"
          description="Edit the details of your book"
        />
      </div>
    </div>
  )
}
