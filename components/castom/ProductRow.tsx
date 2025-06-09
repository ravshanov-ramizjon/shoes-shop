'use client'

import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'react-feather'

type Props = {
  product: {
    id: string
    name: string
    price: number
    image: string
    description: string
    category: string
  }
  onEdit: (product: Props['product']) => void
  onDelete: (id: string) => void
}

export default function ProductCard({ product, onEdit, onDelete }: Props) {
  return (
    <Card className="w-full max-w-sm sm:max-w-md flex flex-col border border-cyan-400 rounded-lg 
      cursor-pointer bg-gray-900 text-cyan-300 hover:text-white transition-shadow 
      hover:shadow-[0_0_20px_cyan] p-0">

      <CardHeader className="p-0">
        <div className="relative w-full h-48 sm:h-60 md:h-64 rounded-t-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={1000}
            height={1000}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow px-4 pt-3 pb-1">
        <CardTitle className="text-lg sm:text-xl font-bold drop-shadow-[0_0_8px_cyan]">
          {product.name}
        </CardTitle>
        <CardDescription className="text-cyan-400 text-sm sm:text-base mt-1">
          {product.price} сум
        </CardDescription>
        <div className="text-cyan-300 text-xs sm:text-sm mt-2 line-clamp-2 drop-shadow-[0_0_3px_cyan]">
          {product.description}
        </div>
      </CardContent>

      <CardFooter className="flex justify-center gap-4 pb-4 px-4">
        <Button
          size="sm"
          variant="outline"
          className="border-cyan-500 text-cyan-400 hover:bg-cyan-600 hover:text-white 
          shadow-[0_0_10px_cyan] hover:shadow-[0_0_20px_cyan] cursor-pointer"
          onClick={() => onEdit(product)}
        >
          <Edit size={16} />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="bg-red-700 text-red-300 hover:bg-red-800 hover:text-white 
          shadow-[0_0_10px_#f87171] hover:shadow-[0_0_20px_#ef4444] cursor-pointer"
          onClick={() => onDelete(product.id)}
        >
          <Trash2 size={16} />
        </Button>
      </CardFooter>
    </Card>
  )
}
