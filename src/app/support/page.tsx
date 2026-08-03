"use client";

import { useState } from "react";
import { Heart, Smartphone, Copy, Check } from "lucide-react";

export default function SupportPage() {
  // Updated amounts to accurate local currency estimates (e.g. ₱500 / ₱1,500 target)
  const currentDonations = 500;
  const goal = 1500;
  const progressPercent = Math.min((currentDonations / goal) * 100, 100);

  // Copy state management
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Replace with your real account details
  const gcashNumber = "0951-151-5256";
  const gcashName = "J** N. P."; // Optional: Initials/Account Name

  const mayaNumber = "0951-151-5256";
  const mayaName = "J** N. P.";   // Optional: Initials/Account Name

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="w-full pt-8 sm:pt-12 pb-28 sm:pb-36 px-4 max-w-4xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 bg-rose-100 dark:bg-rose-950/50 rounded-full text-rose-500 mb-1">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Support What Makes You Happy ❤️
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          If this platform brought a smile to your face or gave you a cozy corner to vent, consider supporting it. Your help covers hosting, database maintenance, and keeps this space running freely for everyone.
        </p>
      </div>

      {/* Monthly Hosting Goal Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm space-y-4">
        <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
          <span className="text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            Monthly Server & Maintenance Goal
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-mono">
            ₱{currentDonations.toLocaleString()} / ₱{goal.toLocaleString()} ({Math.round(progressPercent)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-3.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Every contribution—no matter how small—goes directly into keeping the site active and ad-free.
        </p>
      </div>

      {/* GCash & Maya Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* GCash Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-blue-500/5 dark:bg-blue-500/10 backdrop-blur-lg border border-blue-200/60 dark:border-blue-900/40 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight flex items-center gap-2">
                <Smartphone className="w-6 h-6" /> GCash
              </span>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-full uppercase">
                E-Wallet
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Send directly via express send on your GCash app using the number below.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-400">Account Details</span>
                <span className="text-sm font-mono font-bold text-gray-800 dark:text-gray-100">{gcashNumber}</span>
                <span className="text-[11px] text-gray-500 font-medium">{gcashName}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(gcashNumber, "gcash")}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-200 transition-all flex items-center gap-1.5 text-xs font-semibold"
              >
                {copiedField === "gcash" ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Maya Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-500/5 dark:bg-emerald-500/10 backdrop-blur-lg border border-emerald-200/60 dark:border-emerald-900/40 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight flex items-center gap-2">
                <Smartphone className="w-6 h-6" /> Maya
              </span>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-full uppercase">
                PayMaya / Bank
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Transfer via Maya app or any local bank (InstaPay/PESONet).
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-400">Account Details</span>
                <span className="text-sm font-mono font-bold text-gray-800 dark:text-gray-100">{mayaNumber}</span>
                <span className="text-[11px] text-gray-500 font-medium">{mayaName}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(mayaNumber, "maya")}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-200 transition-all flex items-center gap-1.5 text-xs font-semibold"
              >
                {copiedField === "maya" ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}