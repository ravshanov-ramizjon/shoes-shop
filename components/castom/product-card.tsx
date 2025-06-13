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
import { toast } from "sonner"

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

    if (!session?.user.id) {
      toast.error("Пожалуйста, зарегистрируйтес или войдите в свой аккаунт для покупки")
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

    if (isInCart) return

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
      className="transition-shadow hover:shadow-[0_0_20px_cyan] bg-gray-900 flex flex-col border-none rounded-lg cursor-pointer text-cyan-300 hover:text-white p-0"
    >
      <CardHeader className="p-0">
        <div className="relative w-full h-62 rounded-t-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={208}
            className="object-cover h-full object-center transition-transform duration-300 hover:scale-105"
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow p-4">
        <CardTitle className="text-xl font-bold drop-shadow-[0_0_8px_cyan]">
          {product.name}
        </CardTitle>
        <CardDescription className="text-cyan-400 text-sm mt-1 flex-grow">
          {product.description}
        </CardDescription>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="font-bold text-lg drop-shadow-[0_0_8px_cyan]">
          ${product.price.toFixed(2)}
        </span>
        <Button
          variant="default"
          onClick={handleBuy}
          disabled={isInCart}
          className={`bg-cyan-600 cursor-pointer hover:bg-cyan-500 shadow-[0_0_15px_cyan] ${
            isInCart
              ? "opacity-60 cursor-not-allowed"
              : "hover:shadow-[0_0_25px_cyan] transition"
          }`}
        >
          {isInCart ? "В корзине" : "Купить"}
        </Button>
      </CardFooter>
    </Card>
  )
}