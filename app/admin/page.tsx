import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import {
  FiUser,
  FiPhone,
  FiMail,
  FiBox,
  FiArrowRightCircle,
  FiCalendar,
} from "react-icons/fi"
import Link from "next/link"

type OrderStatus = "PENDING" | "PROCESSED" | "COMPLETED"

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/")
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/")
  }

  const orders = (await prisma.order.findMany({
    include: {
      items: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  })).map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
  }))

  return (
    <div className="bg-gray-900">
    <main className="p-6 max-w-6xl mx-auto space-y-8">
    <h1 className="text-4xl font-bold text-cyan-400 drop-shadow-[0_0_10px_cyan] flex items-center gap-3">
      <FiBox className="text-cyan-500" />
      Все заказы
    </h1>
  
    {orders.map((order) => (
      <div
        key={order.id}
        className="bg-[#0f0f0f] border border-cyan-600 rounded-xl p-6 shadow-[0_0_15px_#00FFFF40] transition-all duration-300 hover:shadow-[0_0_25px_cyan] hover:scale-[1.01]"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-300 flex items-center gap-1">
              <FiCalendar className="text-cyan-500" />
              {new Date(order.createdAt).toLocaleDateString("ru-RU")}
            </p>
            <p className="text-base text-white font-semibold mt-1">
              Статус:{" "}
              <span
                className={`px-2 py-1 rounded-md text-xs font-bold uppercase shadow-[0_0_6px_#00FFFF] 
                  ${
                    order.status === "COMPLETED"
                      ? "bg-green-500 text-white"
                      : order.status === "PROCESSED"
                      ? "bg-yellow-400 text-black"
                      : order.status === "CANCELED"
                      ? "bg-red-600 text-white"
                      : "bg-blue-600 text-white"
                  }`}
              >
                {order.status}
              </span>
            </p>
          </div>
  
          <Link
            href={`/admin/orders/${order.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-lg transition shadow-[0_0_10px_cyan] hover:shadow-[0_0_15px_cyan]"
          >
            Изменить статус <FiArrowRightCircle />
          </Link>
        </div>
  
        <div className="mt-4 text-sm text-cyan-300 space-y-1">
          <p className="flex items-center gap-2">
            <FiUser /> <strong className="text-white">{order.name}</strong>
          </p>
          <Link
            href={`tel:${order.phone}`}
            className="flex items-center gap-2 hover:text-white transition"
          >
            <FiPhone /> {order.phone}
          </Link>
          <Link
            href={`mailto:${order.user?.email}`}
            className="flex items-center gap-2 hover:text-white transition"
          >
            <FiMail /> {order.user?.email ?? "Гость"}
          </Link>
        </div>
  
        <ul className="mt-4 text-sm text-cyan-200 pl-5 list-disc space-y-1">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="font-semibold text-white">
                {item.price * item.quantity} сум
              </span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </main>
    </div>
  
  )
}
