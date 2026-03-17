"use client"

import { ReactNode } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { LanguageProvider } from "@/lib/languageContext"

interface Props {
  children: ReactNode
}

export default function ClientLayout({ children }: Props) {
  return (
    <LanguageProvider>
      <Navbar />
      <main className="min-h-[80vh] py-10 px-4 md:px-10">
        {children}
      </main>
      <Footer />
    </LanguageProvider>
  )
}
