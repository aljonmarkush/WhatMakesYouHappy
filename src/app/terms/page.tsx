// src/app/terms/page.tsx
import Link from "next/link";
import { FileText, ArrowLeft, CheckCircle2, AlertTriangle, Scale } from "lucide-react";

export default function TermsPage() {
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
        <div className="inline-flex items-center justify-center p-3.5 bg-amber-100 dark:bg-amber-950/50 rounded-full text-amber-600 dark:text-amber-400 mb-1">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Please read these terms carefully before using What Makes You Happy. By accessing or posting on this platform, you agree to these guidelines.
        </p>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="p-6 rounded-3xl bg-gray-100/80 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 space-y-3">
          <div className="p-2.5 w-fit rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            Free to Use
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            This site is provided free of charge as an open community space for sharing human warmth.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-3xl bg-gray-100/80 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 space-y-3">
          <div className="p-2.5 w-fit rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            Content Rights
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            You retain ownership of text you write, but grant us license to display it publicly on this site.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-3xl bg-gray-100/80 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 space-y-3">
          <div className="p-2.5 w-fit rounded-2xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            Responsible Conduct
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Users must abide by community safety standards and refrain from posting malicious content.
          </p>
        </div>

      </div>

      {/* Full Document Body */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 shadow-sm space-y-8 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By visiting or interacting with <strong>What Makes You Happy</strong>, you agree to follow these Terms of Service and our Community Guidelines. If you do not agree with any part of these terms, please refrain from using the application.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            2. User Submissions & Moderation
          </h2>
          <p>
            When submitting a story, headline, image, or comment, you warrant that your contribution is appropriate and does not violate copyright or third-party rights. We reserve the right to remove or modify any post that breaches safety standards or community guidelines without prior notice.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            3. Disclaimer of Liability
          </h2>
          <p>
            This website is provided on an "as-is" and "as-available" basis. While we strive to maintain high availability and a cozy atmosphere, we are not responsible for user-generated content or occasional service interruptions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            4. Service Updates
          </h2>
          <p>
            We may periodically update these terms or add new features to improve the user experience. Continued use of the platform following any modifications constitutes acceptance of the new terms.
          </p>
        </section>

      </div>

    </div>
  );
}