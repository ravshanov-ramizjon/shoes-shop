'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuIcon, LogOutIcon } from 'lucide-react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

export default function AdminHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isUsers = pathname.startsWith('/admin/users')
  const isOrders = pathname.startsWith('/admin/orders')
  const isProducts = pathname.startsWith('/admin')

  const getNavLinks = () => {
    if (isUsers) {
      return [
        { href: '/admin', label: 'Товары' },
        { href: '/admin/orders', label: 'Все заказы' },
      ]
    }
    if (isOrders) {
      return [
        { href: '/admin/users', label: 'Пользователи' },
        { href: '/admin', label: 'Товары' },
      ]
    }
    return [
      { href: '/', label: 'Вернуться в магазин' },
      { href: '/admin/users', label: 'Пользователи' },
      { href: '/admin/orders', label: 'Все заказы' },
    ]
  }

  const navLinks = getNavLinks()

  return (
    <header className="bg-gray-800 z-50 border-b border-cyan-500 shadow-[0_0_15px_cyan]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/admin"
          className="text-2xl font-bold tracking-widest text-cyan-400 hover:text-neon transition-all duration-200"
        >
          Admin Panel
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="font-bold text-cyan-400 hover:text-white transition duration-200"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="font-bold text-cyan-400 hover:text-white transition flex items-center gap-1"
          >
            <LogOutIcon className="w-4 h-4" />
            Logout
          </button>
        </nav>

        {/* Mobile Menu Trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-cyan-400 hover:bg-gray-800 hover:text-white cursor-pointer"
            >
              <MenuIcon className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="top"
            className="bg-gray-850 text-cyan-300 px-6 py-8 border-b border-cyan-500 backdrop-blur-xl shadow-[0_0_20px_cyan] animate-in slide-in-from-top fade-in duration-500 rounded-b-xl"
          >
            <nav className="flex flex-col space-y-5 text-lg font-medium">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="hover:text-white transition"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setOpen(false)
                  signOut({ callbackUrl: '/' })
                }}
                className="hover:text-white transition flex items-center gap-2"
              >
                <LogOutIcon className="w-4 h-4" />
                Logout
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
