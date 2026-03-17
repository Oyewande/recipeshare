import { NextResponse, NextRequest } from "next/server"

// In Next.js 16+, this file replaces middleware.ts.
// The exported function must be named `proxy` (NextProxy type).
export function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // Forward the user's preferred language to pages via a custom header
  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) {
    const preferredLang =
      acceptLanguage.split(",")[0]?.split("-")[0]?.trim() || "en"
    response.headers.set("x-preferred-language", preferredLang)
  }

  return response
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and API routes
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
}
