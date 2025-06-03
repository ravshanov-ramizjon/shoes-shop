import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

type OrderStatus = "PENDING" | "PROCESSED" | "COMPLETED"
type OrderItem = {
  id: string
  orderId: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Props {
  params: Promise<{ id: string }>
}

async function updateStatus(id: string, nextStatus: OrderStatus | null) {
  "use server"
  if (!nextStatus) return
  await prisma.order.update({
    where: { id },
    data: { status: nextStatus },
  })
  redirect("/admin/orders")
}

export default async function EditOrderPage({ params }: Props) {
  const { id } = await params

  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!order) {
    return <div>Заказ не найден</div>
  }

  const nextStatus: OrderStatus | null =
    order.status === "PENDING"
      ? "PROCESSED"
      : order.status === "PROCESSED"
      ? "COMPLETED"
      : null

  async function handleUpdateStatus() {
    await updateStatus(id, nextStatus)
  }

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Статус заказа: {order.status}</h1>
      <ul className="text-sm list-disc pl-5">
        {order.items.map((item: OrderItem) => (
          <li key={item.id}>
            {item.name} × {item.quantity} = {item.price * item.quantity} сум
          </li>
        ))}
      </ul>

      {nextStatus ? (
        <form action={handleUpdateStatus}>
          <Button type="submit">Изменить статус на: {nextStatus}</Button>
        </form>
      ) : (
        <p>Статус уже COMPLETED ✅</p>
      )}
    </main>
  )
}
