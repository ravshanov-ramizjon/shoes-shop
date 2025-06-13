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

export default function AdminHeader() {
    const pathname = usePathname()

    const isUsers = pathname.startsWith('/admin/users')
    const isOrders = pathname.startsWith('/admin/orders')
    const isProducts = pathname.startsWith('/admin')

    // Функция для генерации ссылок
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
        // если на странице продуктов
        return [
            { href: '/', label: 'Вернуться в магазин' },
            { href: '/admin/users', label: 'Пользователи' },
            { href: '/admin/orders', label: 'Все заказы' },
        ]
    }

    const navLinks = getNavLinks()

    return (
        <header className="bg-gray-800 z-50  border-cyan-500 shadow-lg">
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
                            className=" font-bold tracking-widest text-cyan-400 hover:text-neon transition-all duration-200"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className=" font-bold tracking-widest text-cyan-400 hover:text-neon transition-all duration-200 cursor-pointer flex items-center gap-1"
                    >
                        <LogOutIcon className="w-4 h-4" />
                        Logout
                    </button>
                </nav>

                  {/* Mobile Menu Trigger */}
                  <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-cyan-400 hover:bg-gray-800"
                        >
                            <MenuIcon className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="top" className="bg-gray-900 text-cyan-300 p-6">
                        <nav className="flex flex-col space-y-4">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="hover:text-white transition"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="hover:text-white transition flex items-center gap-2"
                            >
                                <LogOutIcon className="w-4 h-4" /> Logout
                            </button>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
