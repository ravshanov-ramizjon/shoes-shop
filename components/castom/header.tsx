"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut, signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart,
  Home,
  PackageCheck,
  LogOut,
  LogIn,
  ShieldCheck,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { MdOutlinePersonOutline } from "react-icons/md"
import Image from "next/image"
import { useSyncUserRole } from "@/hooks/useSyncUserRole"
import dynamic from "next/dynamic"
const MobileBottomNav = dynamic(() => import("@/components/castom/MobileBottomNav"), { ssr: false })

export function Header() {
  useSyncUserRole()

  const { data: session } = useSession()
  const pathname = usePathname()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const isAdmin = session?.user?.role === "ADMIN"
  const isBlocked = session?.user?.role === "BLOCK"

  const navItems = [
    { href: "/", label: "Каталог", icon: Home },
    { href: "/cart", label: "Корзина", icon: ShoppingCart },
    { href: "/orders", label: "Мои заказы", icon: PackageCheck, authOnly: true },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 bg-gray-900 border-b border-[#1a1a1a] shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-widest text-cyan-400 hover:text-neon transition-all duration-200">
          👟 ОбувьМаркет
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-4 items-center">
          {navItems.map(
            ({ href, label, icon: Icon, authOnly }) =>
              (!authOnly || session) &&
              !isActive(href) && (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-neon transition"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              )
          )}

          {/* Вход или профиль */}
          {!session ? (
            <Button
              size="sm"
              className="cursor-pointer text-white hover:border-neon hover:text-neon"
              onClick={() => signIn()}
            >
              <LogIn className="w-4 h-4 mr-1" />
              Войти
            </Button>
          ) : (
            <>
              <div onClick={() => setIsProfileOpen(true)} className="cursor-pointer">
                {session?.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover hover:scale-105 transition-transform"
                  />
                ) : (
                  <MdOutlinePersonOutline
                    size={27}
                    className="text-gray-400 hover:text-neon transition"
                  />
                )}
              </div>

              <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent className="bg-gray-900 text-white border border-cyan-500 shadow-lg shadow-cyan-500/20">
                  <DialogHeader>
                    <DialogTitle className="text-cyan-400 text-lg mb-1">Профиль</DialogTitle>
                    <DialogDescription className="text-sm text-gray-400">
                      Информация о вашем аккаунте
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col items-center gap-2 mt-4">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="avatar"
                        width={64}
                        height={64}
                        className="rounded-full border border-cyan-400 shadow-md shadow-cyan-500/30"
                      />
                    ) : (
                      <MdOutlinePersonOutline
                        size={64}
                        className="text-gray-500 border border-cyan-400 rounded-full p-2"
                      />
                    )}
                    <p className="text-lg font-semibold">{session.user.name || "Имя не указано"}</p>
                    <p className="text-sm text-gray-400">{session.user.email || "Email отсутствует"}</p>

                    {isBlocked && (
                      <p className="bg-red-500 text-white rounded px-3 py-2 text-center text-sm mt-3">
                        Ваш аккаунт заблокирован. Обратитесь в поддержку.
                      </p>
                    )}

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-1 mt-3 text-cyan-400 hover:text-cyan-200 transition text-sm"
                      >
                        <ShieldCheck className="w-4 h-4" />

                        Перейти в админ-панель
                      </Link>
                    )}

                    <Button
                      variant="destructive"
                      onClick={() => {
                        setIsProfileOpen(false)
                        signOut({ callbackUrl: "/" })
                      }}
                      className="w-full mt-4"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Выйти
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </nav>

        {/* Mobile nav */}
        <MobileBottomNav />
      </div>
    </header>
  )
}
