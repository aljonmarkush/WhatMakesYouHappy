// src/app/privacy/page.tsx
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, Server, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
        <div className="inline-flex items-center justify-center p-3.5 bg-blue-100 dark:bg-blue-950/50 rounded-full text-blue-500 mb-1">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Your privacy and anonymity are fundamental to what makes this space safe. Here is how we handle data.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="p-6 rounded-3xl bg-gray-100/80 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 space-y-3">
          <div className="p-2.5 w-fit rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            No Accounts Needed
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            You don't need to sign up, provide an email, or create a profile to share your stories.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-3xl bg-gray-100/80 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 space-y-3">
          <div className="p-2.5 w-fit rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            Anonymous Submissions
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Shared stories contain only the information you explicitly type into the submission form.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-3xl bg-gray-100/80 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 space-y-3">
          <div className="p-2.5 w-fit rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            No Data Selling
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            We never sell, rent, or trade user data or submission history to third parties or advertisers.
          </p>
        </div>

      </div>

      {/* Full Content Container */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 shadow-sm space-y-8 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            1. Information Collected
          </h2>
          <p>
            When you post a moment on <strong>What Makes You Happy</strong>, we store the text contents (Headline, Category, Details, optional author name/dedication) and any image you choose to upload. No identity tracking or personal profile data is associated with your post.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            2. Image Processing
          </h2>
          <p>
            Images uploaded alongside moments are stored on secure cloud storage. We recommend ensuring that uploaded images do not contain confidential personal details or sensitive identifiable information.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            3. Essential Analytics & Cookies
          </h2>
          <p>
            We may use basic, privacy-focused analytics to understand overall site traffic and application health. No intrusive cross-site tracking cookies are deployed for advertising purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            4. Content Moderation
          </h2>
          <p>
            To maintain a positive environment, posts violating our Community Guidelines may be removed by administrators without prior notification.
          </p>
        </section>

      </div>

    </div>
  );
}