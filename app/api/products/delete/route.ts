import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(req: Request) {
  const { id } = await req.json()

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 })
  }

  try {
    const deleted = await prisma.product.deleteMany({
      where: { id },
    })

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
