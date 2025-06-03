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


    const productId = (product.id)
    const isInCart = items.some((item) => String(item.id) === product.id)

    const handleBuy = async () => {

        if (!session?.user?.email) {
            alert("Вы должны войти в систему")
            return
        }

        if (isInCart) return

        const res = await fetch("/api/getUserId")
        const data = await res.json()

        if (!res.ok) {
            alert("Ошибка при получении пользователя")
            return
        }

        const userId = data.userId

        if (isInCart) return // Не добавлять повторно

        const cartItem = {
            id: productId,
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-16">
                 <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Главная</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{product.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="relative w-full aspect-square overflow-hidden rounded-2xl shadow-md">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-center"
            />
          </div>
      
          <div className="space-y-6">      
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{product.name}</h1>
      
            <p className="text-muted-foreground text-base">
              Категория: {product.category.name}
            </p>
      
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              {product.description}
            </p>
      
            <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t">
              <span className="text-2xl sm:text-3xl font-semibold text-black">
                ${product.price.toFixed(2)}
              </span>
      
              {isInCart ? (
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/cart")}
                >
                  В корзине
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
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
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
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
                      <Card className="hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="relative h-40 overflow-hidden rounded-t-xl p-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                          <CardTitle className="text-base font-semibold line-clamp-1">
                            {item.name}
                          </CardTitle>
                          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </CardDescription>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between items-center">
                          <span className="text-lg font-bold text-black">
                            ${item.price.toFixed(2)}
                          </span>
                          {relatedInCart ? (
                            <Button
                              size="sm"
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
      
    )
}
