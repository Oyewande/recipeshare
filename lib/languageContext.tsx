"use client"

import { createContext, useState, ReactNode, useContext, useEffect } from "react"

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {}
})

const SUPPORTED_LANGUAGES = ["en", "es", "fr", "de"]

export function LanguageProvider({ children }: { children: ReactNode }) {

  const [language, setLanguage] = useState("en")
  
  useEffect(() => {
    // On load, detect user preference from Storage or Browser
    const storedLang = localStorage.getItem("preferredLanguage")
    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
      setLanguage(storedLang)
    } else if (typeof navigator !== "undefined") {
      const browserLang = navigator.language.split('-')[0]
      if (SUPPORTED_LANGUAGES.includes(browserLang)) {
        setLanguage(browserLang)
      }
    }
  }, [])

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("preferredLanguage", lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}