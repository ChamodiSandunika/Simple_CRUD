"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Book } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BookFormProps {
  initialData?: Book
  onSubmit: (data: Omit<Book, "id">) => Promise<void>
  submitLabel: string
  title: string
  description: string
}

export function BookForm({ 
  initialData, 
  onSubmit, 
  submitLabel, 
  title, 
  description 
}: BookFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Omit<Book, "id">>({
    title: initialData?.title || "",
    author: initialData?.author || "",
    isbn: initialData?.isbn || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto border-2 border-indigo-200 shadow-xl bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-indigo-100">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold text-gray-700">📚 Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter book title"
              className="border-2 border-indigo-200 focus:border-indigo-500 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author" className="text-base font-semibold text-gray-700">✍️ Author *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
              placeholder="Enter author name"
              className="border-2 border-indigo-200 focus:border-indigo-500 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="isbn" className="text-base font-semibold text-gray-700">🔢 ISBN *</Label>
            <Input
              id="isbn"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              required
              placeholder="Enter ISBN"
              className="border-2 border-indigo-200 focus:border-indigo-500 text-base font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-base font-semibold text-gray-700">💰 Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              required
              placeholder="0.00"
              className="border-2 border-green-200 focus:border-green-500 text-base font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold text-gray-700">📝 Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter book description"
              rows={4}
              className="border-2 border-indigo-200 focus:border-indigo-500 text-base"
            />
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="border-2 border-gray-300 hover:bg-gray-100 font-semibold text-base"
            >
              ❌ Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold text-base px-8">
              {isSubmitting ? "⏳ Saving..." : `✅ ${submitLabel}`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
