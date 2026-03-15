import { NextResponse } from "next/server";

export function middleware(request: Request) {

  const language = request.headers.get("accept-language");

  return NextResponse.next();
}
