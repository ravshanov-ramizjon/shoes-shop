import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, context: { params: { userId: string } }) {
  try {
    const userId = Number(context.params)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Неверный ID пользователя" }, { status: 400 })
    }

    const items = await prisma.cartItem.findMany({
      where: { userId },
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Ошибка при получении корзины:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
