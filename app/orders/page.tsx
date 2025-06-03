"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FiPackage, FiCheckCircle, FiClock } from "react-icons/fi"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  productId?: string
  orderId?: string
}

interface Order {
  id: string
  createdAt: string // ISO string из API
  status: "PENDING" | "PROCESSED" | "COMPLETED"
  items: OrderItem[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/orders")
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/api/auth/signin")
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data?.orders) {
          setOrders(data.orders)
        } else {
          setOrders([])
        }
      })
      .catch(() => setOrders([]))
  }, [router])

  if (orders === null) {
    return <p className="text-center mt-10">Загрузка заказов...</p>
  }

  if (orders.length === 0) {
    return (
      <main className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          Мои заказы
        </h1>
        <p className="text-center text-gray-500 mt-8 text-base sm:text-lg">
          У вас ещё нет заказов.
        </p>
      </main>
    )
  }

  const statusIcon = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return <FiClock className="inline-block mr-1 text-yellow-500" />
      case "PROCESSED":
        return <FiPackage className="inline-block mr-1 text-blue-500" />
      case "COMPLETED":
        return <FiCheckCircle className="inline-block mr-1 text-green-500" />
      default:
        return null
    }
  }

  return (
    <main className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
        Мои заказы
      </h1>

      <AnimatePresence>
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="border rounded-lg p-4 sm:p-6 space-y-3 shadow-sm bg-white"
          >
            <p className="text-sm text-gray-500">
              Заказ от {new Date(order.createdAt).toLocaleDateString("ru-RU")}
            </p>
            <p className="text-sm">
              Статус:{" "}
              <span className="font-medium flex items-center">
                {statusIcon(order.status)}
                {order.status === "PENDING"
                  ? "В ожидании"
                  : order.status === "PROCESSED"
                  ? "Обрабатывается"
                  : "Завершён"}
              </span>
            </p>

            <div className="space-y-2 text-sm">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <span className="truncate max-w-[70%] sm:max-w-[80%]">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold whitespace-nowrap">
                    {item.price * item.quantity} сум
                  </span>
                </div>
              ))}
            </div>

            <p className="text-right font-bold text-base sm:text-lg mt-4">
              Итого:{" "}
              {order.items.reduce(
                (sum, i) => sum + i.price * i.quantity,
                0
              )}{" "}
              сум
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </main>
  )
}
