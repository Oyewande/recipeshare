import "./globals.css"
import { ReactNode } from "react"
import type { Metadata } from "next"
import ClientLayout from "@/components/ClientLayout"

export const metadata: Metadata = {
  title: "FlavorBridge — Taste the World, One Recipe at a Time",
  description: "Discover authentic dishes from around the globe, seamlessly translated into your language. Share your culture's flavors with the world.",
  keywords: ["recipes", "cooking", "multilingual", "translation", "global cuisine"],
}

interface LayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={`bg-vanilla-cream text-hunter-green`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
