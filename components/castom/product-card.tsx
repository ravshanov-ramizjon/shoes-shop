"use client"

import Image from "next/image"
import { useCart } from "@/lib/cart-store"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    image: string
    category: { id: string; name: string }
  }
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { data: session } = useSession()
  const { items, addItem } = useCart()
  const isInCart = items.some((item) => item.id === (product.id))
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/product/${product.id}`)
  }

  const handleBuy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
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
    <Card
      onClick={handleCardClick}
      className="transition-shadow hover:shadow-xl bg-white flex flex-col border-0">
      <CardHeader className="p-0 px-5">
        <div className="relative w-full h-50">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={200}
            className="object-cover object-center rounded-t-lg h-50"
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow p-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {product.name}
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm mt-1 flex-grow">
          {product.description}
        </CardDescription>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-black font-bold text-lg">
          ${product.price.toFixed(2)}
        </span>
        <Button variant="default" onClick={handleBuy} disabled={isInCart}>
          {isInCart ? "В корзине" : "Купить"}
        </Button>
      </CardFooter>
    </Card>
  )
}
