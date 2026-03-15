import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t border-stone-200/50 dark:border-stone-800/50 mt-20 bg-stone-50/50 dark:bg-stone-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌶️</span>
              <span className="text-lg font-extrabold text-stone-900 dark:text-white">
                Flavor<span className="text-hunter-green">Bridge</span>
              </span>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-xs">
              Bridging cultures through cuisine. Discover, share, and translate recipes from around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-stone-500 dark:text-stone-400">
              <li><Link href="/explore" className="hover:text-hunter-green transition-colors">Explore Recipes</Link></li>
              <li><Link href="/submit" className="hover:text-hunter-green transition-colors">Submit a Recipe</Link></li>
              <li><Link href="/map" className="hover:text-hunter-green transition-colors">Global Map</Link></li>
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-white uppercase tracking-wider mb-4">Languages</h4>
            <div className="flex flex-wrap gap-2">
              {["English", "Español", "Français", "Deutsch"].map(lang => (
                <span key={lang} className="text-xs px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 dark:border-stone-800 pt-6 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} FlavorBridge. Built with ❤️ for food lovers everywhere.
        </div>
      </div>
    </footer>
  )
}