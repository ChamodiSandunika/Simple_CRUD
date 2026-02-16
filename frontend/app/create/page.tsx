"use client"

import { useRouter } from "next/navigation"
import { BookForm } from "@/components/book-form"
import { createBook } from "@/lib/api"
import { Book } from "@/lib/types"
import { toast } from "sonner"

export default function CreateBookPage() {
  const router = useRouter()

  const handleSubmit = async (data: Omit<Book, "id">) => {
    try {
      await createBook(data)
      toast.success("✅ Book created successfully!")
      router.push("/")
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create book"
      toast.error(`❌ ${message}`)
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <BookForm
          onSubmit={handleSubmit}
          submitLabel="Create Book"
          title="Create New Book"
          description="Add a new book to your collection"
        />
      </div>
    </div>
  )
}
