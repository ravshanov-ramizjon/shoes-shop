'use client'

import { useState } from 'react'
import { Input } from '../ui/input'

type Props = {
  onUploaded: (url: string) => void
  initialImage?: string
}

export default function ImageUploader({ onUploaded, initialImage }: Props) {
  const [preview, setPreview] = useState<string | null>(initialImage || null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Ошибка при загрузке:', errorText)
        alert('Ошибка загрузки изображения')
        return
      }

      const data = await res.json()
      const imageUrl = data.secure_url || data.url

      if (!imageUrl) {
        alert('Сервер не вернул ссылку на изображение')
        return
      }

      onUploaded(imageUrl)
    } catch (err) {
      console.error('Ошибка загрузки:', err)
      alert('Произошла ошибка при загрузке файла')
    }
  }

  return (
    <div>
      <Input type="file" accept="image/*" onChange={handleUpload} />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-2 w-32 h-32 object-cover rounded"
        />
      )}
    </div>
  )
}
