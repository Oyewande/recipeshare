/**
 * Detect the user's preferred language from the browser.
 * Returns a 2-letter ISO 639-1 language code (e.g. "en", "es", "fr").
 */
export function detectLanguage(): string {
  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language.split("-")[0]
  }
  return "en"
}
