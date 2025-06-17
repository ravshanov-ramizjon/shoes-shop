"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  ShoppingCart,
  PackageCheck,
  LogIn,
  LogOut,
  Settings,
  ShieldCheck,
} from "lucide-react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { MdOutlinePersonOutline } from "react-icons/md"
import { Button } from "@/components/ui/button"

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    setIsAdmin(session?.user?.role === "ADMIN")
  }, [session])

  const navItems = [
    { href: "/", label: "Каталог", icon: Home },
    { href: "/cart", label: "Корзина", icon: ShoppingCart },
    { href: "/orders", label: "Заказы", icon: PackageCheck, authOnly: true },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-gray-900 border-t border-cyan-400 shadow-[0_0_15px_cyan] flex justify-around py-2">
        {navItems.map(({ href, label, icon: Icon, authOnly }) => {
          if (authOnly && !session) return null

          const active = isActive(href)

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center text-xs transition ${
                active
                  ? "text-cyan-400 drop-shadow-[0_0_6px_cyan]"
                  : "text-gray-400 hover:text-cyan-300"
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 transition-transform ${active ? "scale-110" : ""}`} />
              {label}
            </Link>
          )
        })}

        {/* Профиль или вход */}
        {session ? (
          <button
            onClick={() => setDialogOpen(true)}
            className="flex flex-col items-center text-xs text-gray-400 hover:text-cyan-300 transition"
          >
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt="User Avatar"
                width={24}
                height={24}
                className="rounded-full mb-1 object-cover"
              />
            ) : (
              <MdOutlinePersonOutline size={24} className="mb-1" />
            )}
            Аккаунт
          </button>
        ) : (
          <button
            onClick={() => signIn()}
            className="flex flex-col items-center text-xs text-gray-400 hover:text-cyan-300 transition cursor-pointer"
          >
            <LogIn className="w-5 h-5 mb-1" />
            Войти
          </button>
        )}
      </nav>

      {/* Модалка профиля */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border border-cyan-500 max-w-sm space-y-4">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">Профиль</DialogTitle>
          </DialogHeader>

          {session?.user?.role === "BLOCK" && (
            <div className="bg-red-600 text-sm text-white px-4 py-2 rounded shadow">
              Ваш аккаунт был заблокирован. <br />
              Обратитесь в поддержку для разблокировки.
            </div>
          )}

          <div className="flex items-center gap-4">
            {session?.user.image ? (
              <Image
                src={session.user.image}
                alt="User Avatar"
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            ) : (
              <MdOutlinePersonOutline size={48} />
            )}
            <div>
              <p className="text-sm font-semibold">{session?.user.name}</p>
              <p className="text-xs text-gray-400">{session?.user.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setDialogOpen(false)}
                className="flex items-center p-2 gap-2 hover:text-cyan-400 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                Админ-панель
              </Link>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-red-500 hover:text-red-600 justify-start"
              onClick={() => {
                setDialogOpen(false)
                signOut({ callbackUrl: "/" })
              }}
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
