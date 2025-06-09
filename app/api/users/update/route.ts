import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, email, password, role } = body

    const data: any = {
      name,
      email,
      role,
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      data.password = hashedPassword
    }

    await prisma.user.update({
      where: { id },
      data,
    })

    return new NextResponse("Пользователь обновлён", { status: 200 })
  } catch (error) {
    console.error("Ошибка обновления пользователя:", error)
    return new NextResponse("Ошибка сервера", { status: 500 })
  }
}
