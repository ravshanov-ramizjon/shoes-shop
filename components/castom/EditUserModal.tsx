"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FiEye, FiEyeOff } from "react-icons/fi" // 👈 импорт иконок

type Props = {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  onClose: () => void
  onSave: () => void
}

export default function EditUserModal({ user, onClose, onSave }: Props) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState("")
  const [role, setRole] = useState(user.role)
  const [showPassword, setShowPassword] = useState(false) // 👈 состояние

  const handleSave = async () => {
    await fetch("/api/users/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.id,
        name,
        email,
        password,
        role,
      }),
    })

    onSave()
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#111] border-cyan-500 shadow-[0_0_20px_cyan]">
        <DialogHeader className="text-cyan-300 text-xl font-bold mb-2">
            <DialogTitle>
          Редактировать пользователя
            </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            className="bg-black text-white border-cyan-600 focus:ring-cyan-400"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            className="bg-black text-white border-cyan-600 focus:ring-cyan-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <Input
              className="bg-black text-white border-cyan-600 focus:ring-cyan-400 pr-10"
              type={showPassword ? "text" : "password"}
              placeholder="Новый пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-cyan-400"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <select
            className="w-full px-3 py-2 bg-black text-white border border-cyan-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="BLOCK">BLOCK</option>
          </select>

          <Button
            className="bg-cyan-600 hover:bg-cyan-500 w-full text-white mt-4"
            onClick={handleSave}
          >
            💾 Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
