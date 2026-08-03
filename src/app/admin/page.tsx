"use client";

import { ShieldAlert, CheckCircle, Trash2, Database } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Moderation Dashboard
          </h1>
          <p className="text-sm text-gray-500">Review reported content and maintain community safety.</p>
        </div>
      </div>

      {/* Moderation Queue */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-gray-100 dark:border-gray-800 space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2 text-rose-500">
          <ShieldAlert className="w-5 h-5" /> Pending Content Reports
        </h3>

        <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 font-semibold px-2 py-0.5 rounded-md">
              Inappropriate Content
            </span>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Reported story #8412 by @user_xyz
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
              <CheckCircle className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}