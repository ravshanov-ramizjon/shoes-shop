import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/authOptions"

export async function POST(req: NextRequest) {
  const { items } = await req.json()


  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  try {
    await prisma.cartItem.deleteMany({ where: { userId: user.id } })
    await prisma.cartItem.createMany({
      data: items.map((item) => ({
        userId: user.id,
        productId: String(item.id),
        quantity: Number(item.quantity),
        name: String(item.name),
        price: Number(item.price),
        image: String(item.image),
      })),
    })

    return NextResponse.json({ message: "Cart updated" })
  } catch (error) {
    console.error("Failed to sync cart:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
