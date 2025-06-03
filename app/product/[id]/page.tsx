import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProductDetailClient from "@/components/castom/ProductDetailClient"

type Props = {
  params: { id: string }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  })

  if (!product) return notFound()

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    include: { category: true },
    take: 10,
  })

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />
}
