"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import LanguageSwitcher from "./LanguageSwitcher"
import { useUI } from "@/lib/useUI"

export default function Navbar() {
  const pathname = usePathname()
  const { t } = useUI()

  const NAV_LINKS = [
    { href: "/explore", label: t("navExplore") },
    { href: "/submit",  label: t("navSubmit") },
    { href: "/map",     label: t("navMap") },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-stone-200/30 dark:border-stone-800/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Brand — intentionally never translated */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:rotate-12 transition-transform">🌶️</span>
          <span className="text-xl font-extrabold tracking-tight text-stone-900 dark:text-white">
            Flavor<span className="text-hunter-green">Bridge</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                pathname === link.href
                  ? "bg-hunter-green text-white shadow-sm"
                  : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-2 border-l border-stone-200 dark:border-stone-800 pl-3">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}
