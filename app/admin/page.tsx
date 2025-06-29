'use client'

import { useEffect, useState, useCallback } from 'react'
import AddProductForm from '@/components/castom/addProductForm'
import EditProductForm from '@/components/castom/EditProductForm'
import ProductCard from '@/components/castom/ProductRow'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useMeta } from '@/hooks/useMeta'
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'

type Product = {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const { data: session } = useSession()
  
  useMeta({
    title: 'ShoesStore — Админка: Товары',
    description: 'Панель управления товарами магазина.'
  })
  console.log("Session:", session)
  if (!session) {
    redirect("/")
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      if (!res.ok) throw new Error('Ошибка загрузки продуктов')
      const data = await res.json()
      setProducts(data)
    } catch {
      setProducts([])
      toast.error('Ошибка загрузки продуктов')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAddClick = () => setAddModalOpen(true)

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setEditModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      toast.custom((id: string | number) => (
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
          <p>Вы уверены, что хотите удалить товар?</p>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => {
                resolve(true)
                toast.dismiss(id)
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Да
            </button>
            <button
              onClick={() => {
                resolve(false)
                toast.dismiss(id)
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
            >
              Нет
            </button>
          </div>
        </div>
      ), { duration: Infinity })
      
    })

    if (!confirmed) return

    try {
      const res = await fetch('/api/products/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      toast.success('Товар удалён')
      await fetchProducts()
     }  catch {
      toast.error('Ошибка при удалении товара')
     }
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="bg-gray-800 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]">
            Управление товарами
          </h1>
          <Button
            onClick={handleAddClick}
            size="lg"
            className="bg-cyan-600 text-white hover:bg-cyan-700 shadow-[0_0_10px_#06b6d4]"
          >
            Добавить товар
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-cyan-300">Загрузка товаров...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-cyan-300">Нет товаров</p>
        ) : (
          <>
            <div className="text-sm text-cyan-400 mb-4 drop-shadow-[0_0_5px_#22d3ee]">
              Всего товаров: {products.length}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2 sm:px-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}

        <AddProductForm
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSuccess={() => {
            fetchProducts()
            setAddModalOpen(false)
          }}
        />

        <EditProductForm
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSuccess={() => {
            fetchProducts()
            setEditModalOpen(false)
          }}
          initialData={
            selectedProduct || {
              id: '',
              name: '',
              price: 0,
              image: '',
              description: '',
              category: ''
            }
          }
        />
      </div>
    </div>
  )
}
