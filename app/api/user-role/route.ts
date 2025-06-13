// app/api/user-role/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma"; // подключи свой экземпляр Prisma

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ role: null });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  return NextResponse.json({ role: user?.role || null });
}
