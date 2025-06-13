// app/api/getUserId/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.email) {
    
    alert("Пожалуйста, сделайте свой email видимым в настройках профиля, чтобы мы могли идентифицировать вас.")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ userId: user.id })
}
