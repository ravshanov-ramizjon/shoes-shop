import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",

    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: "read:user user:email" } },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string

        if (!email || !password) throw new Error("Email и пароль обязательны")

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) throw new Error("Пользователь не найден")
        if (!user.password) throw new Error("Войдите через Google или GitHub")

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error("Неверный пароль")

        return {
          id: user.id.toString(),
          name: user.name ?? "",
          email: user.email ?? "",
          image: user.image ?? null,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Если логин только что произошёл — сохраняем роль
      if (user) {
        token.id = user.id
        token.email = user.email ?? ""
        token.name = user.name ?? ""
        token.role = user.role ?? "USER"
      } else if (token.id) {
        // 🔁 При рефреше — загружаем роль из БД
        const dbUser = await prisma.user.findUnique({
          where: { id: Number(token.id) },
          select: { role: true },
        })
        token.role = dbUser?.role ?? "USER"
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
})
