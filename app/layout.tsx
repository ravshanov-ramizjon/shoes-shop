"use client"
import "./globals.css"
import { Inter } from "next/font/google"
import { Header } from "@/components/castom/header"
import { AuthProvider } from "@/components/castom/SessionProvider"
import { SyncCart } from "@/components/castom/SyncCart"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AuthProvider>
          <SyncCart />
          <Header />
          <main>
            {children}
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
