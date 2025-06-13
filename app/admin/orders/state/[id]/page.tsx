import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FiArrowRightCircle } from "react-icons/fi"
import Link from "next/link"

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

// ✅ Обновление статуса заказа
async function updateStatus(formData: FormData) {
  "use server"

  const id = formData.get("id") as string
  const nextStatus = formData.get("nextStatus") as OrderStatus

  if (!id || !nextStatus) return

  await prisma.order.update({
    where: { id },
    data: { status: nextStatus },
  })

  redirect("/admin/orders")
}

export default async function EditOrderPage({ params }: Props) {
  const { id } = await params

  const session = await auth()
  if (!session?.user?.email) redirect("/")

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!currentUser || currentUser.role !== "ADMIN") redirect("/")

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!order) return <div>Заказ не найден</div>

  const nextStatus: OrderStatus | null =
    order.status === "PENDING"
      ? "PROCESSED"
      : order.status === "PROCESSED"
        ? "COMPLETED"
        : order.status === "CANCELED"
          ? null
          : null

  return (
    <div className="bg-gray-900 h-screen">
      <main className="bg-gray-900 p-6 max-w-xl mx-auto space-y-6 text-white">
        <Link
          href="../"
          className="text-cyan-400 drop-shadow-[0_0_10px_cyan] border border-cyan-300 p-1 px-1.5 rounded-full hover:text-cyan-300 transition"
        >
          ←
        </Link>

        <div className="flex pt-2 items-center justify-between">
          <h1 className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_10px_cyan]">
            Статус заказа:
            <span
              className={`ml-2 text-base px-2 py-1 rounded-md uppercase font-semibold shadow-sm
          ${order.status === "COMPLETED"
                  ? "bg-green-600 text-white"
                  : order.status === "PROCESSED"
                    ? "bg-yellow-400 text-black"
                    : order.status === "CANCELED"
                      ? "bg-red-600 text-white"
                      : "bg-blue-600 text-white"
                }`}
            >
              {order.status}
            </span>
          </h1>
        </div>

        <ul className="mt-4 space-y-3">
          {order.items.map((item: OrderItem) => (
            <li
              key={item.id}
              className="flex items-center gap-4 p-3 border border-cyan-700 bg-[#111] rounded-lg shadow-[0_0_10px_cyan] hover:shadow-[0_0_15px_cyan] transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md border border-cyan-400 shadow-[0_0_6px_cyan]"
              />
              <div className="flex-1">
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-sm text-cyan-300">
                  Кол-во: {item.quantity} × {item.price} сум
                </p>
                <p className="text-sm font-semibold text-cyan-400 drop-shadow-[0_0_6px_cyan]">
                  = {item.price * item.quantity} сум
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Статусные сообщения или кнопка */}
        {order.status === "CANCELED" ? (
          <p className="text-red-500 font-medium pt-4">
            Заказ был отменен ✅
          </p>
        ) : nextStatus ? (
          <form action={updateStatus} className="pt-4">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="nextStatus" value={nextStatus} />
            <Button
              type="submit"
              className="w-full gap-2 text-base font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_10px_cyan] hover:shadow-[0_0_15px_cyan] transition"
            >
              Изменить статус на: {nextStatus}
              <FiArrowRightCircle className="w-5 h-5" />
            </Button>
          </form>
        ) : (
          <p className="text-green-500 font-medium pt-4">
            Статус уже COMPLETED ✅
          </p>
        )}
      </main>
    </div>

  )
}
