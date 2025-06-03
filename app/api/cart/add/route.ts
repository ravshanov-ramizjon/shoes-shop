import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { userId, item } = await req.json()

    // Проверка: есть ли уже такой товар у пользователя
    const existing = await prisma.cartItem.findFirst({
      where: {
        userId: userId,
        productId: item.id,
      },
    })

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      })
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productId: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка при добавлении в корзину:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
