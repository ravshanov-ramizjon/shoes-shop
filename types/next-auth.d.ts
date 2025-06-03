import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string | null
      email: string | null
      role: string
    }
  }


  interface User {
    id: string
    name: string | null
    email: string | null
    role: string
  }

}
type OrderWithItems = {
  id: string
  name: string
  quantity: number
  price: number
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    email: string
    name: string
    role?: string
  }
}