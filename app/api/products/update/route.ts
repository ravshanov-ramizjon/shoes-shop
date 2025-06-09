import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
  try {
    const { id, name, price, image, description, category } = await req.json()

    if (!id || !name || !price || !image || !description) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: category }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Выберите категорию' }, { status: 404 })
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
        image,
        description,
        categoryId: existingCategory.id
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[UPDATE_PRODUCT_ERROR]', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
