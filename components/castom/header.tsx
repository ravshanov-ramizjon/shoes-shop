"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut, signIn } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Menu,
  ShoppingCart,
  Home,
  PackageCheck,
  LogOut,
  LogIn,
} from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { DialogDescription, DialogTitle } from "../ui/dialog"

export function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Каталог", icon: Home },
    { href: "/cart", label: "Корзина", icon: ShoppingCart },
    { href: "/orders", label: "Мои заказы", icon: PackageCheck, authOnly: true },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tight">
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
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              )
          )}

          {session ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="w-4 h-4 mr-1" />
              Выйти
            </Button>
          ) : (
            <Button size="sm" onClick={() => signIn()}>
              <LogIn className="w-4 h-4 mr-1" />
              Войти
            </Button>
          )}
        </nav>

        {/* Mobile nav */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <VisuallyHidden>
              <DialogTitle>Меню</DialogTitle>
              <DialogDescription>Это мобильное меню для удобства навигации</DialogDescription>
            </VisuallyHidden>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top">
              <div className="pt-6 flex flex-col gap-4">
                {navItems.map(
                  ({ href, label, icon: Icon, authOnly }) =>
                    (!authOnly || session) &&
                    !isActive(href) && (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 text-sm hover:text-primary transition"
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    )
                )}

                {session ? (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setOpen(false)
                      signOut({ callbackUrl: "/" })
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти
                  </Button>
                ) : (
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setOpen(false)
                      signIn()
                    }}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Войти
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
