'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useState, useEffect } from 'react'
import ImageUploader from './upload'

const categories = [
  { id: 'men', name: 'Мужская обувь' },
  { id: 'women', name: 'Женская обувь' },
  { id: 'kids', name: 'Детская обувь' }
]

type ProductData = {
  id: string
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
  initialData: ProductData
}

export default function EditProductForm({ open, onClose, onSuccess, initialData }: Props) {
  const [formData, setFormData] = useState<ProductData>(initialData)

  // При открытии диалога обновляем данные формы, 
  // чтобы правильно выставить категорию (id из массива categories)
  useEffect(() => {
    if (open) {
      const matchedCategory = categories.find(
        cat => cat.id === initialData.category || cat.name === initialData.category
      )
      setFormData({ ...initialData, category: matchedCategory ? matchedCategory.id : '' })
    }
  }, [open])

  // Обновляем поле формы при изменении input'ов
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Обновляем категорию при выборе в селекте
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }))
  }

  // Отправляем обновлённые данные на сервер
  const handleSubmit = async () => {
    // Проверяем, что все поля заполнены
    if (!formData.name || !formData.price || !formData.image || !formData.description) {
      alert('Пожалуйста, заполните все поля')
      return
    }

    const res = await fetch('/api/products/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    // Если успешно, вызываем onSuccess и закрываем форму
    if (res.ok) {
      onSuccess()
      onClose()
    } else {
      const errorData = await res.json()
      alert(errorData.error || 'Ошибка при обновлении продукта')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full p-6 sm:p-8 rounded-lg
        bg-white dark:bg-gray-900
        overflow-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Редактировать товар
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
            <Label>Ссылка на изображение</Label>
            <ImageUploader
              onUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
              initialImage={formData?.image}
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
                <SelectValue placeholder="Выберите категорию">
                  {categories.find(cat => cat.id === formData.category)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map(({ id, name }) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
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
              Сохранить изменения
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
