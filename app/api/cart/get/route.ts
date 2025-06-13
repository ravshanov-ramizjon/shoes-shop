// app/api/cart/get/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { Product: true },
  })

  const formatted = cartItems.map((item: any) => ({
    id: item.Product.id,
    name: item.Product.name,
    price: item.Product.price,
    image: item.Product.image,
    quantity: item.quantity,
  }))

  return NextResponse.json({ items: formatted })
}
