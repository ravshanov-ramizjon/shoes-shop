"use client"
import "./globals.css"
import { Inter } from "next/font/google"
import { Header } from "@/components/castom/header"
import { AuthProvider } from "@/components/castom/SessionProvider"
import { SyncCart } from "@/components/castom/SyncCart"

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
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
