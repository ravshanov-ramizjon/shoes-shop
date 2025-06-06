import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { OrderStatus } from "@prisma/client" // ВАЖНО: импорт enum

export async function PATCH(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const { orderId } = params

        const updated = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: OrderStatus.CANCELED, 
            },
        })

        return NextResponse.json({ success: true, order: updated })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { success: false, error: "Ошибка при отмене заказа" },
            { status: 500 }
        )
    }
}
