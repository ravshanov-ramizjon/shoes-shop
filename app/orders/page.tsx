"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiX,
} from "react-icons/fi"
import CancelOrderDialog from "@/components/castom/CancelOrderDialog"


interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

type OrderStatus = "PENDING" | "PROCESSED" | "COMPLETED" | "CANCELED"

interface Order {
  id: string
  createdAt: string
  canceledAt?: string
  status: OrderStatus
  items: OrderItem[]
}



export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/orders")
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/auth")
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data?.orders) setOrders(data.orders)
        else setOrders([])
      })
      .catch(() => setOrders([]))
  }, [])

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "PATCH",
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        toast.error("Не удалось отменить заказ.")
        return
      }

      toast.success("Заказ отменён.")

      setOrders((prev) =>
        prev?.map((order) =>
          order.id === orderId ? data.order : order
        ) || []
      )
    } catch (error) {
      toast.error("Произошла ошибка.")
      console.error(error)
    }
  }

  const statusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <FiClock className="mr-2 text-yellow-400" />
      case "PROCESSED":
        return <FiPackage className="mr-2 text-blue-400" />
      case "COMPLETED":
        return <FiCheckCircle className="mr-2 text-green-400" />
      case "CANCELED":
        return <FiX className="mr-2 text-red-400" />
      default:
        return null
    }
  }

  if (orders === null) {
    return (
      <p className="text-center mt-10 text-cyan-400 animate-pulse">
        Загрузка заказов...
      </p>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-gray-900 h-screen">
        <main className="bg-gray-900 h-screen p-4 sm:p-6 max-w-4xl mx-auto space-y-6 text-white">
          <h1 className="text-3xl font-bold text-center text-cyan-400">
            Мои заказы
          </h1>
          <p className="text-center text-gray-400 mt-8 text-lg">
            У вас ещё нет заказов.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 h-screen">
      <main className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 text-white">
        <h1 className="text-3xl font-bold text-center sm:text-left text-cyan-400">
          Мои заказы
        </h1>

        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-cyan-400 rounded-lg p-4 sm:p-6 space-y-3 shadow-[0_0_15px_cyan] bg-gray-900 hover:shadow-[0_0_25px_cyan] transition"
          >
            <div className="flex justify-between items-center text-sm text-gray-400">
              <p>
                <span className="text-[20px]">Заказ</span> <br />
                <span className="text-white font-medium">
                  Дата:{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("ru-RU")
                    : "неизвестно"}
                </span>
              </p>
              <div className="flex flex-col items-end text-right">
                <div className="flex items-center">
                  {statusIcon(order.status)}
                  <span className="text-white font-semibold">
                    {order.status === "PENDING"
                      ? "В ожидании"
                      : order.status === "PROCESSED"
                        ? "Обрабатывается"
                        : order.status === "COMPLETED"
                          ? "Завершён"
                          : "Отменён"}
                  </span>
                </div>
                {order.status === "CANCELED" && order.canceledAt && (
                  <span className="text-xs text-red-400 mt-1">
                    Отменён:{" "}
                    {new Date(order.canceledAt).toLocaleDateString("ru-RU")}
                  </span>
                )}
              </div>
            </div>


            <div className="space-y-2 text-sm">
              {!order.items || order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-zinc-700 pb-1"
                >
                  <span className="truncate max-w-[70%] text-gray-300">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold text-cyan-300">
                    {item.price * item.quantity} сум
                  </span>
                </div>
              ))}
            </div>


            <div className="flex items-center justify-between pt-4">
              <p className="text-cyan-400 font-bold text-lg">
                Итого:{" "}
                {!order.items || order.items.reduce(
                  (sum, i) => sum + i.price * i.quantity,
                  0
                )}{" "}
                сум
              </p>

              {(order.status === "PENDING" || order.status === "PROCESSED") && (
                <CancelOrderDialog
                  orderId={order.id}
                  onConfirm={handleCancelOrder}
                />
              )}
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  )
}
