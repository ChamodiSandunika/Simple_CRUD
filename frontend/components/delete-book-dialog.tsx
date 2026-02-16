"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Book } from "@/lib/types"
import { deleteBook } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface DeleteBookDialogProps {
  book: Book
}

export function DeleteBookDialog({ book }: DeleteBookDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!book.id) return

    setIsDeleting(true)
    setError(null)

    try {
      await deleteBook(book.id.toString())
      setIsOpen(false)
      router.push("/")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete book")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    router.back()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="border-2 border-red-300 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full shadow-lg">
              <AlertTriangle className="h-7 w-7 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">Delete Book?</span>
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 pt-2">
            ⚠️ <strong>Warning:</strong> This action cannot be undone. The book will be permanently removed from your collection.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 rounded-xl p-6 border-2 border-indigo-200 shadow-inner">
          <div className="flex items-start gap-4">
            <div className="bg-white p-3 rounded-lg shadow-md">
              <div className="text-4xl">📚</div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{book.title}</h3>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <span className="text-lg">✍️</span>
                  <span className="font-medium">by {book.author}</span>
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white/80 rounded-lg p-3 border border-indigo-200">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">ISBN</p>
                  <p className="text-sm font-mono font-bold text-gray-800 mt-1">{book.isbn}</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 border border-indigo-200">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Price</p>
                  <p className="text-lg font-bold text-green-600 mt-1">${book.price.toFixed(2)}</p>
                </div>
              </div>
              
              {book.description && (
                <div className="bg-white/80 rounded-lg p-3 border border-indigo-200">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Description</p>
                  <p className="text-sm text-gray-700 line-clamp-3">{book.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-100 border-2 border-red-400 p-4 text-base text-red-700 font-semibold flex items-center gap-2 shadow-sm">
            <div className="bg-red-200 p-1 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-700" />
            </div>
            <span>{error}</span>
          </div>
        )}

        <DialogFooter className="gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
            className="border-2 border-gray-300 hover:bg-gray-100 font-semibold px-6 py-5 text-base"
            size="lg"
          >
            <span className="text-lg mr-2">←</span> Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 hover:shadow-xl font-bold px-6 py-5 text-base transition-all"
            size="lg"
          >
            {isDeleting ? "⏳ Deleting..." : "🗑️ Delete Book"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
