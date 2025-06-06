"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut, signIn } from "next-auth/react"
import { useState, useEffect } from "react"
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
  ShieldCheck,
} from "lucide-react"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { DialogHeader } from "../ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MdOutlinePersonOutline } from "react-icons/md";


export function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {

      setIsAdmin(session?.user.role ? true : false)
      console.log("User role:", session)
    }
    if (session) checkAdmin()
  }, [session])

  const navItems = [
    { href: "/", label: "Каталог", icon: Home },
    { href: "/cart", label: "Корзина", icon: ShoppingCart },
    { href: "/orders", label: "Мои заказы", icon: PackageCheck, authOnly: true },
    { href: "/admin", label: "Админ", icon: ShieldCheck, authOnly: true, adminOnly: true },
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
            ({ href, label, icon: Icon, authOnly, adminOnly }) =>
              (!authOnly || session) &&
              (!adminOnly || isAdmin) &&
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
          <DropdownMenu>
            <DropdownMenuTrigger><MdOutlinePersonOutline className="flex items-center gap-2 text-sm text-gray-400 hover:text-neon transition " size={27} /></DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900 text-white border-0">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {session?.user?.role === "BLOCK" && (
                <DropdownMenuItem className="bg-red-500 hover:bg-red-600">
                  Вы были заблокированы, <br /> обратитесь в поддержку <br /> для решения проблемы.
                </DropdownMenuItem>
              )}

              <DropdownMenuItem className="">

                {session ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-black "
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Выйти
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="hover:text-black"
                    onClick={() => signIn()}
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    Войти
                  </Button>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </nav>

        {/* Mobile nav */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0f0f0f] text-white border-b border-[#1a1a1a] p-5">
              <DialogHeader className="hidden">
                <DialogTitle>Меню</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              Меню
              <div className="pt-2 flex flex-col gap-4">
                {navItems.map(
                  ({ href, label, icon: Icon, authOnly, adminOnly }) =>
                    (!authOnly || session) &&
                    (!adminOnly || isAdmin) &&
                    !isActive(href) && (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 text-sm hover:text-neon transition"
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    )
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger><MdOutlinePersonOutline className="text-sm text-white hover:text-neon transition " size={20} /> Account</DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-900 text-white border-0">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {session?.user?.role === "BLOCK" && (
                      <DropdownMenuItem className="bg-red-500 hover:bg-red-600">
                        Вы были заблокированы, <br /> обратитесь в поддержку <br /> для решения проблемы.
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem className="">

                      {session ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-black "
                          onClick={() => signOut({ callbackUrl: "/" })}
                        >
                          <LogOut className="w-4 h-4 mr-1" />
                          Выйти
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="hover:text-black"
                          onClick={() => signIn()}
                        >
                          <LogIn className="w-4 h-4 mr-1" />
                          Войти
                        </Button>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* {session ? (
                  <Button
                    variant="ghost"
                    className="mt-4 text-white hover:text-neon"
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
                    className="mt-4 text-white border border-white hover:border-neon hover:text-neon"
                    onClick={() => {
                      setOpen(false)
                      signIn()
                    }}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Войти
                  </Button>
                )} */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
