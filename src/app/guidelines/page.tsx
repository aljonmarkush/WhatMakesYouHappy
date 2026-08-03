// src/app/guidelines/page.tsx
import Link from "next/link";
import { HeartHandshake, Smile, ShieldAlert, Sparkles, ArrowLeft, MessageSquareHeart } from "lucide-react";

export default function GuidelinesPage() {
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
        <div className="inline-flex items-center justify-center p-3.5 bg-emerald-100 dark:bg-emerald-950/50 rounded-full text-emerald-500 mb-1">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
          Community Guidelines
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          To keep this space safe, warm, and uplifting for everyone, we ask all members of our community to follow these gentle principles.
        </p>
      </div>

      {/* Core Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Guideline 1 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 space-y-3">
          <div className="p-2.5 w-fit rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <Smile className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">
            1. Spread Kind & Positive Energy
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Focus on moments of joy, gratitude, personal peace, and hope. This is a place to celebrate the small things that make life meaningful.
          </p>
        </div>

        {/* Guideline 2 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 space-y-3">
          <div className="p-2.5 w-fit rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">
            2. Respect Other Stories
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            What brings happiness to one person might seem trivial to another. Treat everyone’s feelings with empathy, acceptance, and care.
          </p>
        </div>

        {/* Guideline 3 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 space-y-3">
          <div className="p-2.5 w-fit rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">
            3. Zero Tolerance for Hate
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Bullying, discrimination, hate speech, harassment, and explicit content are strictly prohibited and will be removed immediately.
          </p>
        </div>

        {/* Guideline 4 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 space-y-3">
          <div className="p-2.5 w-fit rounded-2xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">
            4. Protect Your Privacy
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Keep your posts anonymous or general. Do not post personal sensitive data, phone numbers, addresses, or private details about others.
          </p>
        </div>

      </div>

      {/* Note Banner */}
      <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
        <h4 className="font-bold text-emerald-700 dark:text-emerald-400 text-sm sm:text-base">
          Let’s Keep This Sanctuary Gentle
        </h4>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Thank you for helping us maintain a comforting, safe corner on the internet for everyone.
        </p>
      </div>

    </div>
  );
}