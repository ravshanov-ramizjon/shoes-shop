import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
type OrderStatus = "PENDING" | "PROCESSED" | "COMPLETED"
import Link from "next/link"

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions)

  // // 🛡 Только для админов
  // if (!session?.user || session.user.role !== "ADMIN") {
  //   redirect("/")
  // }

  const orders = (await prisma.order.findMany({
    include: {
      items: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  })).map((order: { id: string; createdAt: Date; status: OrderStatus; name: string; phone: string; user: { email: string | null } | null; items: { id: string; name: string; quantity: number; price: number }[] }) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
  })) as {
    id: string
    createdAt: string
    status: OrderStatus
    name: string
    phone: string
    user: { email: string | null } | null
    items: { id: string; name: string; quantity: number; price: number }[]
  }[]

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Все заказы</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="border rounded-lg p-4 shadow-sm space-y-2"
        >
          <p className="text-sm text-muted-foreground">
            Заказ от {new Date(order.createdAt).toLocaleDateString("ru-RU")} |{" "}
            Статус:{" "}
            <strong className="uppercase text-blue-700">{order.status}</strong>
          </p>
          <p className="text-sm">
            Клиент: <strong>{order.name}</strong> | Тел: {order.phone}
          </p>
          <p className="text-sm">Email: {order.user?.email ?? "Гость"}</p>

          <ul className="text-sm pl-4 list-disc">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.name} × {item.quantity} = {item.price * item.quantity} сум
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 mt-2">
            <Link
              href={`/admin/orders/${order.id}`}
              className="text-sm underline text-blue-600"
            >
              Изменить статус
            </Link>
          </div>
        </div>
      ))}
    </main>
  )
}
