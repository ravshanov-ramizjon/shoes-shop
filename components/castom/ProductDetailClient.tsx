"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCart } from "@/lib/cart-store"
import { useSession } from "next-auth/react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: {
    name: string
  }
}
interface RelatedProduct extends Product { }
interface ProductDetailClientProps {
  product: Product
  relatedProducts: RelatedProduct[]
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { items, addItem } = useCart()
  const router = useRouter()
  const { data: session } = useSession()

  const isInCart = items.some((item) => String(item.id) === product.id)

  const handleBuy = async () => {
    if (!session?.user?.email) {
      toast.error("Пожалуйста, войдите в систему для покупки")
      return
    }

    if (isInCart) return

    const res = await fetch("/api/getUserId")
    const data = await res.json()

    if (!res.ok) {
      toast("Ошибка при получении пользователя")
      return
    }

    const userId = data.userId

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    }

    addItem(cartItem)

    await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        item: cartItem,
      }),
    })
  }

  return (
    <div className="bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 space-y-10 text-cyan-300">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="hover:text-cyan-400 hover:drop-shadow-[0_0_8px_cyan]">
                Главная
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-cyan-400">{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="relative w-full aspect-square overflow-hidden rounded-2xl shadow-[0_0_20px_cyan]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-center"
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold drop-shadow-[0_0_8px_cyan]">{product.name}</h1>

            <p className="text-cyan-400 text-base">
              Категория: <span className="font-semibold">{product.category.name}</span>
            </p>

            <p className="text-base sm:text-lg text-cyan-200 leading-relaxed">
              {product.description}
            </p>

            <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-cyan-700">
              <span className="text-3xl font-bold drop-shadow-[0_0_6px_cyan]">
                ${product.price.toFixed(2)}
              </span>

              {isInCart ? (
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-cyan-600 text-white shadow-[0_0_15px_cyan]"
                  onClick={() => router.push("/cart")}
                >
                  В корзине
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_cyan] transition"
                  onClick={handleBuy}
                >
                  Купить
                </Button>
              )}
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold drop-shadow-[0_0_8px_cyan]">
              Похожие товары
            </h2>

            <div className="overflow-x-auto scrollbar-hide -mx-2 sm:mx-0">
              <div className="flex gap-4 px-2 sm:px-0">
                {relatedProducts.map((item) => {
                  const itemId = item.id
                  const relatedInCart = items.some((ci) => ci.id === itemId)

                  return (
                    <Link
                      key={item.id}
                      href={`/product/${item.id}`}
                      className="w-[240px] sm:w-[280px] flex-shrink-0"
                    >
                      <Card className="bg-gray-800 border border-cyan-500 text-cyan-300 hover:shadow-[0_0_15px_cyan] transition-shadow duration-300">
                        <CardHeader className="relative h-40 overflow-hidden rounded-t-xl p-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                          <CardTitle className="text-base font-semibold drop-shadow-[0_0_6px_cyan] line-clamp-1">
                            {item.name}
                          </CardTitle>
                          <CardDescription className="text-sm text-cyan-400 line-clamp-2">
                            {item.description}
                          </CardDescription>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between items-center">
                          <span className="text-lg font-bold drop-shadow-[0_0_6px_cyan]">
                            ${item.price.toFixed(2)}
                          </span>
                          {relatedInCart ? (
                            <Button
                              size="sm"
                              className="bg-cyan-600 shadow-[0_0_10px_cyan]"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                router.push("/cart")
                              }}
                            >
                              В корзине
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_10px_cyan] transition"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleBuy()
                              }}
                            >
                              Купить
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
