"use client"

import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ReactNode } from "react"
import { LanguageProvider } from "@/lib/languageContext"

interface LayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={`bg-vanilla-cream text-hunter-green`}>
        <LanguageProvider>
          <Navbar />

          <main className="min-h-[80vh] py-10 px-4 md:px-10">
            {children}
          </main>

          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}