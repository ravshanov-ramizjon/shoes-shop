import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, price, image, description, category } = await req.json()

    if (!name || !image || !description || !price || !category || isNaN(parseFloat(price))) {
      return NextResponse.json({ error: 'Неверные или пустые поля' }, { status: 400 })
    }

    const parsedPrice = parseFloat(price)

    // Найти категорию по названию
    const existingCategory = await prisma.category.findFirst({
      where: { name: category }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Категория не найдена' }, { status: 404 })
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parsedPrice,
        image,
        description,
        categoryId: existingCategory.id
      }
    })

    return NextResponse.json(newProduct)
  } catch (error) {
    console.error('Ошибка при добавлении продукта server:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
