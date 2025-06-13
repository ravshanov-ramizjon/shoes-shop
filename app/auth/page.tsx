"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/castom/icons"

export default function AuthPage() {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ email: "", password: "", name: "" })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isRegister) {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Ошибка при регистрации")
        return
      }

      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      router.push("/")
    } else {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (res?.error) {
        setError(res.error)
      } else {
        router.push("/")
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-900 border border-cyan-400 text-cyan-300 shadow-[0_0_20px_cyan] transition-shadow hover:shadow-[0_0_25px_cyan]">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold drop-shadow-[0_0_8px_cyan]">
            {isRegister ? "Регистрация" : "Вход"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <Label htmlFor="name" className="text-cyan-400">Имя</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Введите имя"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 text-white border-cyan-400 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-cyan-400">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Введите email"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-gray-800 text-white border-cyan-400 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-cyan-400">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Введите пароль"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-gray-800 text-white border-cyan-400 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-semibold shadow-[0_0_15px_cyan] hover:shadow-[0_0_25px_cyan] transition"
            >
              {isRegister ? "Зарегистрироваться" : "Войти"}
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 border-cyan-400 text-cyan-300 bg-gray-900 "
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <Icons.google className="h-5 w-5" />
              Войти через Google
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 border-cyan-400 text-cyan-300 bg-gray-900"
              onClick={() => signIn("github", { callbackUrl: "/" })}
            >
              <Icons.github className="h-5 w-5" />
              Войти через GitHub
            </Button>
          </div>
        </CardContent>

        <CardFooter className="text-center">
          <Button
            variant="link"
            className="text-cyan-400 hover:text-cyan-300 transition"
            onClick={() => {
              setIsRegister(!isRegister)
              setError("")
            }}
          >
            {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
