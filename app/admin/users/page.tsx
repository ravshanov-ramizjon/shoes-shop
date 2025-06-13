import { auth } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import UserRow from "@/components/castom/UserRow"
import { FiUsers } from "react-icons/fi"
import { redirect } from "next/navigation"

export default async function AdminUsersPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

const users = await prisma.user.findMany()

return (
  <div className="p-6 text-white">
    <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-cyan-400">
      <FiUsers /> Пользователи
    </h1>

    <div className="space-y-4">
      {users.map((user) => (
        <UserRow key={user.id} user={user} />
      ))}
    </div>
  </div>
)
}
