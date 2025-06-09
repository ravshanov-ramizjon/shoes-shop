// app/api/categories/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json({ error: "Ошибка загрузки категорий" }, { status: 500 })
  }
}
