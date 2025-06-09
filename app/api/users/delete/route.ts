import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) return new NextResponse("ID не указан", { status: 400 });

    await prisma.user.delete({ where: { id } });

    return new NextResponse("Пользователь удален", { status: 200 });
  } catch (error) {
    console.error("Ошибка удаления пользователя:", error);
    return new NextResponse("Ошибка сервера", { status: 500 });
  }
}
