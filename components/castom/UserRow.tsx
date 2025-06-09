"use client"

import { useState } from "react"
import { FiEdit, FiTrash2 } from "react-icons/fi"
import EditUserModal from "@/components/castom/EditUserModal"

export default function UserRow({ user }: { user: any }) {
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    const confirmed = confirm(`Удалить пользователя ${user.name}?`)
    if (!confirmed) return

    const res = await fetch(`/api/users/delete`, {
      method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id }),
    })

    if (res.ok) {
      location.reload()
    } else {
      alert("Ошибка удаления")
    }
  }

  return (
    <>
      <div className="border border-cyan-500 rounded-xl p-4 shadow-[0_0_15px_#00FFFF50] bg-[#111] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-lg font-semibold text-white">Имя: {user.name}</p>
          <p className="text-sm text-cyan-300">Почта: {user.email}</p>
          <p className="text-sm text-cyan-300">Порол: Порол защищён !</p>
          <p className="text-xs mt-1 text-cyan-400">Роль: {user.role}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setOpen(true)}
            className="px-3 py-2 rounded-md bg-yellow-500 text-black hover:bg-yellow-400 transition shadow-[0_0_10px_yellow] flex items-center gap-1 text-sm"
          >
            <FiEdit /> Изменить
          </button>

          <button
            onClick={handleDelete}
            className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-500 transition shadow-[0_0_10px_red] flex items-center gap-1 text-sm"
          >
            <FiTrash2 /> Удалить
          </button>
        </div>
      </div>

      {open && (
        <EditUserModal
          user={user}
          onClose={() => setOpen(false)}
          onSave={() => location.reload()}
        />
      )}
    </>
  )
}
