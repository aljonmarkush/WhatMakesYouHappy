"use client";

import Link from "next/link";
import { Heart, PlusCircle, Sparkles, User, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-brand-dark dark:text-brand-white">
          <span className="text-2xl">✨</span>
          <span className="hidden sm:inline">What Makes You Happy</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link href="/" className="hover:text-brand-green dark:hover:text-brand-gold transition-colors px-2 py-1">
            Home
          </Link>
          <Link href="/stories" className="hover:text-brand-green dark:hover:text-brand-gold transition-colors px-2 py-1">
            Stories
          </Link>
          <Link href="/insights" className="hover:text-brand-green dark:hover:text-brand-gold transition-colors px-2 py-1">
            Insights
          </Link>
          <Link
            href="/support"
            className="flex items-center gap-1 text-rose-500 font-semibold hover:text-rose-600 transition-colors px-2 py-1"
          >
            Support <Heart className="w-3.5 h-3.5 fill-current" />
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href="/create"
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Share Story</span>
          </Link>
        </div>
      </div>
    </header>
  );
}