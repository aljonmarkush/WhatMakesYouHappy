import Link from "next/link";
import { Heart, Globe, Share2, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md pt-12 pb-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        <div className="col-span-2 space-y-4">
          <span className="text-xl font-bold text-brand-dark dark:text-brand-white">
            What Makes You Happy?
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            A minimalist space dedicated to human stories, empathy, warmth, and mutual comfort.
          </p>
          <div className="pt-2">
            <Link
              href="/support"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-medium text-sm transition-colors shadow-sm"
            >
              <Heart className="w-4 h-4 fill-current" /> Support the Project
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4 text-gray-900 dark:text-white">About</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/about" className="hover:text-gray-900 dark:hover:text-white">Our Mission</Link></li>
            <li><Link href="/guidelines" className="hover:text-gray-900 dark:hover:text-white">Guidelines</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4 text-gray-900 dark:text-white">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-gray-900 dark:hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4 text-gray-900 dark:text-white">Connect</h4>
          <div className="flex gap-3 text-gray-500 dark:text-gray-400">
            <a href="https://github.com/aljonmarkush" target="_blank" rel="noreferrer" className="hover:text-gray-900 dark:hover:text-white"><Globe className="w-5 h-5" /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-gray-900 dark:hover:text-white"><Share2 className="w-5 h-5" /></a>
            <a href="https://www.instagram.com/yen_.005/" target="_blank" rel="noreferrer" className="hover:text-gray-900 dark:hover:text-white"><MessageCircle className="w-5 h-5" /></a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-400 space-y-1">
        <p>Made with ❤️ by @yen_.005</p>
        <p>© 2026 What Makes You Happy. Built with Next.js, Supabase, and Vercel.</p>
      </div>
    </footer>
  );
}