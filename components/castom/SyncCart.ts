// Например, в useEffect где-то после входа
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useCart } from "@/lib/cart-store"

export const SyncCart = () => {
  const { data: session } = useSession()
  const { items, addItem } = useCart()

  useEffect(() => {
    const fetchCart = async () => {
      const res = await fetch("/api/cart/get")
      const data = await res.json()
      if (res.ok) {
        data.items.forEach((item: any) => addItem(item))
      }
    }

    if (session?.user) fetchCart()
  }, [session])

  return null
}
