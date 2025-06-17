"use client"

import { useCart } from "@/lib/cart-store"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { CreditCard, Wallet, Trash2 } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"
import Link from "next/link"
import { useMeta } from "@/hooks/useMeta"

export default function CartPage() {
  const { data: session } = useSession()
  const { items, removeItem, updateQuantity, clearCart, setItems } = useCart()

  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "cash",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

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
      try {
        const res = await fetch("/api/getUserId")
        const resUs = await fetch("/api/getUser")
        const data = await res.json()
        const dataUs = await resUs.json()
        setCurrentUser(dataUs.user)

        if (data.userId) {
          const res = await fetch(`/api/cart/${data.userId}`)
          if (res.ok) {
            const data = await res.json()
            setItems(data.items)
          }
        }
      } catch (err) {
        console.error("Ошибка загрузки корзины:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [session?.user?.id, setItems])

  useEffect(() => {
    if (!session?.user?.id || isLoading) return
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    debounceTimer.current = setTimeout(() => {
      fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, items }),
      }).catch((err) => console.error("Ошибка обновления корзины:", err))
    }, 1000)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [items, session?.user?.id, isLoading])

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
          items,
          total,
        }),
      })

      if (!res.ok) throw new Error("Ошибка оформления заказа")

      clearCart()
      setOpen(false)
      toast.success("Заказ успешно оформлен!")
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error)
      toast.error("Не удалось оформить заказ. Попробуйте позже.")
    }
  }
  useMeta({
    title: 'ShoesStore — Корзина',
    description: 'Ваши выбранные товары в интернет-магазине ShoesStore. Перейдите к оформлению заказа.',
    keywords: 'корзина, обувь, купить обувь, оформление заказа, модная обувь, интернет-магазин'
  })
  return (
    <div className="bg-gray-900">
      <main className="min-h-screen p-6 max-w-5xl mx-auto space-y-8 rounded-lg shadow-lg text-cyan-300">
        <h1 className="text-4xl font-extrabold drop-shadow-[0_0_12px_cyan]">Корзина</h1>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="flex gap-4 p-4 bg-gray-900 border border-cyan-500/30 shadow-[0_0_10px_cyan]"
              >
                <Skeleton className="w-28 h-20 rounded-md bg-gray-900" />
                <div className="flex flex-col justify-between flex-grow">
                  <Skeleton className="h-6 w-3/4 bg-gray-900" />
                  <Skeleton className="h-4 w-1/3 bg-gray-900 mt-2" />
                  <Skeleton className="h-8 w-24 mt-4 bg-gray-900" />
                </div>
              </Card>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-zinc-500 text-lg space-y-3">
            <p>Ваша корзина пуста 🛒</p>
            <Link
              href="/"
              className="underline text-cyan-400 hover:text-cyan-300 transition"
            >
              Перейти в каталог товаров →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <Card
                key={item.id}
                className="flex flex-row  gap-4 p-4 bg-gray-900 border border-cyan-400 rounded-lg shadow-[0_0_15px_cyan] hover:shadow-[0_0_25px_cyan] transition-shadow cursor-default"
              >
                <div className="relative w-28 h-20 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover object-center transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 112px"
                  />
                </div>

                <CardContent className="flex flex-col flex-grow p-0">
                  <CardTitle className="text-cyan-400 font-bold drop-shadow-[0_0_8px_cyan]">
                    {item.name}
                  </CardTitle>
                  <CardDescription className="text-cyan-300 text-sm pt-2">
                    Цена: <span className="font-semibold">{item.price.toLocaleString()} сум</span>
                  </CardDescription>

                  <div className="mt-4 flex items-center gap-4">
                    <Label htmlFor={`qty-${item.id}`} className="text-cyan-400 select-none">
                      Кол-во:
                    </Label>
                    <Input
                      id={`qty-${item.id}`}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value)))}
                      className="w-20 bg-zinc-800 border-cyan-500/40 text-white shadow-[0_0_6px_cyan]"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-4 p-0">
                  <Button
                    variant="destructive"
                    className="bg-red-700 hover:bg-red-800 shadow-[0_0_10px_red] transition-colors"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Удалить ${item.name} из корзины`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}

            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
              <span className="text-2xl font-extrabold drop-shadow-[0_0_12px_cyan]">
                Итого: {total.toLocaleString()} сум
              </span>

              {currentUser?.role === "BLOCK" ? (
                (() => {
                  toast.error("Вы заблокированы. Свяжитесь с администратором.")
                  return null
                })()
              ) : (
                <Button
                  className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold shadow-[0_0_20px_cyan]"
                  onClick={() => setOpen(true)}
                >
                  Оформить заказ
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Диалог оформления заказа */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg rounded-lg bg-zinc-900 border border-cyan-500/60 shadow-[0_0_20px_cyan]">
            <DialogHeader>
              <DialogTitle className="text-cyan-400 font-extrabold text-3xl drop-shadow-[0_0_15px_cyan]">
                Оформление заказа
              </DialogTitle>
              <DialogDescription className="text-cyan-300 mb-4">
                Пожалуйста, заполните данные для доставки и оплаты
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
              className="space-y-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-cyan-400 font-semibold">
                  Имя
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ваше имя"
                  className="bg-zinc-800 border-cyan-500/70 text-white shadow-[0_0_6px_cyan]"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="text-cyan-400 font-semibold">
                  Телефон
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+998 90 123 45 67"
                  className="bg-zinc-800 border-cyan-500/70 text-white shadow-[0_0_6px_cyan]"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="address" className="text-cyan-400 font-semibold">
                  Адрес доставки
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="Улица, дом, квартира"
                  className="bg-zinc-800 border-cyan-500/70 text-white shadow-[0_0_6px_cyan]"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <Label className="text-cyan-400 font-semibold mb-2">Способ оплаты</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={formData.payment === "cash" ? "default" : "outline"}
                        className={
                          formData.payment === "cash"
                            ? "bg-cyan-500 text-black shadow-[0_0_12px_cyan]"
                            : "bg-cyan-500 text-white hover:bg-cyan-500 transition-shadow"
                        }
                        onClick={() => setFormData({ ...formData, payment: "cash" })}
                      >
                        <Wallet className="mr-2 h-5 w-5" />
                        Наличные
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 text-cyan-300 shadow-[0_0_10px_cyan]">
                      Оплата при получении
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"

                        className="bg-zinc-800 text-white cursor-not-allowed opacity-60"
                      >
                        <CreditCard className="mr-2 h-5 w-5" />
                        Карта
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 text-cyan-300 shadow-[0_0_10px_cyan]">
                      Этот способ оплаты пока недоступен
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>


              <div className="flex justify-end gap-4 mt-6">
                <Button
                  onClick={() => setOpen(false)}
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-900"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold shadow-[0_0_20px_cyan]"
                >
                  Подтвердить заказ
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
