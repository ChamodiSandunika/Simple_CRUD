"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getBookById } from "@/lib/api"
import { Book } from "@/lib/types"
import { DeleteBookDialog } from "@/components/delete-book-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export default function DeleteBookPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBook() {
      try {
        const data = await getBookById(id)
        setBook(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Book not found"
        toast.error(`❌ ${message}`)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [id, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-indigo-200 shadow-lg">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-700 font-semibold">Loading...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!book) {
    return null
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <DeleteBookDialog book={book} />
      </div>
    </div>
  )
}
