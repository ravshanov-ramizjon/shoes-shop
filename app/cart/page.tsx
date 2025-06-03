"use client"

import { useCart } from "@/lib/cart-store"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { CreditCard, Wallet } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function CartPage() {
  const { data: session } = useSession()
  const { items, removeItem, updateQuantity, clearCart, setItems } = useCart()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "cash",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
      }))
    }
  }, [session?.user])

  useEffect(() => {
    const fetchCart = async () => {
      const res = await fetch("/api/getUserId")
      const data = await res.json()
      if (!res.ok) {
        console.error("Ошибка при получении пользователя:", data.error)
        return
      }
      if (data.userId) {
        const res = await fetch(`/api/cart/${data.userId}`)
        if (res.ok) {
          const data = await res.json()
          setItems(data.items)
        }
      }
    }

    fetchCart()
  }, [session?.user?.id, setItems])

  useEffect(() => {
    if (!session?.user?.id) return

    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    debounceTimer.current = setTimeout(() => {
      fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          items,
        }),
      }).catch((err) => console.error("Ошибка обновления корзины:", err))
    }, 1000)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [items, session?.user?.id])

  const validateForm = () => {
    const errs: { [key: string]: string } = {}
    if (!formData.name.trim()) errs.name = "Имя обязательно"
    if (!formData.phone.trim()) errs.phone = "Телефон обязателен"
    if (!formData.address.trim()) errs.address = "Адрес обязателен"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          ...formData,
        }),
      })

      if (!res.ok) throw new Error("Ошибка оформления заказа")

      clearCart()
      setOpen(false)
      alert("Заказ успешно оформлен!")
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error)
      alert("Не удалось оформить заказ. Попробуйте снова.")
    }
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-4">Корзина</h1>

      {items.length === 0 ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-4 border p-4 rounded-md">
              <Skeleton className="w-[100px] h-[80px] rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-20 mt-2" />
              </div>
              <Skeleton className="h-10 w-24 self-end sm:self-center" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex sm:flex-row sm:items-center gap-4 border p-4 rounded-md">
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={80}
                className="rounded object-cover w-[100px] h-[80px]"
              />
              <div className="flex-1 space-y-2">
                <h2 className="font-semibold">{item.name}</h2>
                <p>{item.price} сум</p>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  className="border p-1 w-20 rounded"
                />
              </div>
              <Button variant="destructive" onClick={() => removeItem(item.id)}>
                Удалить
              </Button>
            </div>
          ))}
          <div className="flex justify-between items-center align-text-bottom">
            <div className=" font-bold text-xl">Итого: {total} сум</div>
            <div className="">
              <Button className="bg-black hover:bg-zinc-800 text-white" onClick={() => setOpen(true)}>
                Оформить заказ
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Оформление заказа</DialogTitle>
            <DialogDescription>Заполните свои данные</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+998 90 123 45 67"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="address">Адрес</Label>
              <Input
                id="address"
                placeholder="Ваш адрес доставки"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            <div>
              <Label>Способ оплаты</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={formData.payment === "cash" ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, payment: "cash" })}
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Наличные
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Оплата при получении</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Карта
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Этот способ оплаты пока недоступен</TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="text-right">
              <Button className="bg-black hover:bg-zinc-800 text-white" onClick={handleSubmit}>
                Подтвердить заказ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
