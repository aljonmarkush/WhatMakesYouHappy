// src/app/about/page.tsx
import Link from "next/link";
import { Heart, Sparkles, Shield, Users, ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full pt-8 sm:pt-12 pb-28 sm:pb-36 px-4 max-w-4xl mx-auto space-y-12">
      
      {/* Back Button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3.5 bg-rose-100 dark:bg-rose-950/50 rounded-full text-rose-500 mb-1">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
          Our Mission
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          A minimalist space dedicated to human stories, empathy, warmth, and mutual comfort.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Why We Built This Space
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>
            In a fast-paced digital world often filled with noise, pressure, and performative updates, <strong>What Makes You Happy</strong> was created as a quiet sanctuary.
          </p>
          <p>
            We believe that small moments of gratitude, raw personal victories, and quiet reflection carry immense power. Whether you are celebrating a milestone or just seeking a gentle reminder that better days exist, this platform is your safe harbor.
          </p>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 space-y-3">
          <div className="p-2.5 w-fit rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            Authentic Joy
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            No algorithms pushing outrage or clout. Just real human experiences shared genuinely.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 space-y-3">
          <div className="p-2.5 w-fit rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            Safe & Anonymous
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Express yourself freely without fear of judgment, pressure, or privacy exposure.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 space-y-3">
          <div className="p-2.5 w-fit rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            Mutual Comfort
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Finding solace in knowing that someone somewhere feels the same warmth you do.
          </p>
        </div>

      </div>

      {/* Call to Action */}
      <div className="text-center pt-4 space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Want to share what made you smile today?
        </h3>
        <div>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            Share Your Moment
          </Link>
        </div>
      </div>

    </div>
  );
}