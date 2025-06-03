import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { userId, name, phone, address } = await req.json()

    if (!userId || !name || !phone || !address) {
      return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 })
    }

    const numericUserId = parseInt(userId)

    if (isNaN(numericUserId)) {
      return NextResponse.json({ error: "userId должен быть числом" }, { status: 400 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: numericUserId },
    })

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Корзина пуста" }, { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        userId: numericUserId,
        name,
        phone,
        address,
        items: {
          createMany: {
            data: cartItems.map((item: any) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })),
          },
        },
      },
      include: {
        items: true,
      },
    })

    await prisma.cartItem.deleteMany({
      where: { userId: numericUserId },
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("Ошибка при оформлении заказа:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
