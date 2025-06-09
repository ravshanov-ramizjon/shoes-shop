import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(req: Request) {
  const { id } = await req.json()

  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

  await prisma.product.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
