'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import ImageUploader from './upload'

const categories = ['Мужская обувь', 'Женская обувь', 'Детская обувь']

type ProductData = {
  name: string
  price: number | string
  image: string
  description: string
  category: string
}

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: ProductData
}

export default function AddProductForm({ open, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    price: '',
    image: '',
    description: '',
    category: ''
  })

  // Обновляем значение полей при вводе
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Обновляем категорию при выборе в селекте
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }))
  }

  // Отправляем данные формы на сервер
  const handleSubmit = async () => {
    const res = await fetch('/api/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (res.ok) {
      onSuccess()
      onClose()
      // Сброс формы после успешного добавления
      setFormData({ name: '', price: '', image: '', description: '', category: '' })
    } else {
      alert('Ошибка при добавлении продукта')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full p-6 sm:p-8 rounded-lg
        bg-white dark:bg-gray-900
        overflow-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Добавить товар
          </DialogTitle> 
        </DialogHeader>
        <div className="mt-6 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
            <div className="flex-1">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Введите название"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="price">Цена</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="Введите цену"
              />
            </div>
          </div>

          <div>
            <Label>Картинка</Label>
            <ImageUploader
              onUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
            />
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Введите описание"
            />
          </div>

          <div>
            <Label htmlFor="category">Категория</Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger aria-label="Категория">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              onClick={handleSubmit}
              className="w-full sm:w-auto"
              size="lg"
            >
              Добавить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
