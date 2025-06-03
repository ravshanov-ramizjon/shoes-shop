import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface WithAuthNextRequest extends NextRequest {
  nextauth: {
    token: {
      role?: string;
    };
  };
}

export default withAuth(
  function middleware(req: NextRequest) {
    const token = (req as WithAuthNextRequest).nextauth?.token;
    const role = token?.role;

    // если пользователь не админ, редиректим
    if (req.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/auth",
    },
    callbacks: {
      authorized: ({ token }) => !!token, // пускаем, только если токен есть
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/orders/:path*",],
};
