"use client"
import "./globals.css"
import { Inter } from "next/font/google"
import { Header } from "@/components/castom/header"
import { AuthProvider } from "@/components/castom/SessionProvider"
import { SyncCart } from "@/components/castom/SyncCart"
import { Toaster } from "@/components/ui/sonner"
import { usePathname } from 'next/navigation'


const inter = Inter({ subsets: ["latin"] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AuthProvider>
          <SyncCart />
          {!isAdmin && <Header />}
          <>
            {children}
          </>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
} 
