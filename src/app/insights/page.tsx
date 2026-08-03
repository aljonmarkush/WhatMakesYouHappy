"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  BarChart3,
  Smile,
  Frown,
  TrendingUp,
  UserCheck,
  FileText,
  Loader2,
  PieChart as PieIcon,
} from "lucide-react";

interface Story {
  id: string;
  mood: "Smile" | "Sad";
  target_person?: string | null;
  created_at: string;
}

interface Analytics {
  totalStories: number;
  smileCount: number;
  sadCount: number;
  smilePercentage: number;
  sadPercentage: number;
  topTargets: { name: string; count: number }[];
  last7DaysCount: number;
}

export default function InsightsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalStories: 0,
    smileCount: 0,
    sadCount: 0,
    smilePercentage: 0,
    sadPercentage: 0,
    topTargets: [],
    last7DaysCount: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data: stories, error } = await supabase
        .from("stories")
        .select("id, mood, target_person, created_at")
        .eq("is_approved", true);

      if (error) throw error;

      if (stories) {
        processAnalytics(stories as Story[]);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const processAnalytics = (data: Story[]) => {
    const totalStories = data.length;
    const smileCount = data.filter((s) => s.mood === "Smile").length;
    const sadCount = data.filter((s) => s.mood === "Sad").length;

    const smilePercentage = totalStories ? Math.round((smileCount / totalStories) * 100) : 0;
    const sadPercentage = totalStories ? Math.round((sadCount / totalStories) * 100) : 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const last7DaysCount = data.filter(
      (s) => new Date(s.created_at) >= sevenDaysAgo
    ).length;

    const targetMap: Record<string, number> = {};
    data.forEach((s) => {
      if (s.target_person && s.target_person.trim()) {
        const cleanName = s.target_person.trim();
        targetMap[cleanName] = (targetMap[cleanName] || 0) + 1;
      }
    });

    const topTargets = Object.entries(targetMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setAnalytics({
      totalStories,
      smileCount,
      sadCount,
      smilePercentage,
      sadPercentage,
      topTargets,
      last7DaysCount,
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 max-w-5xl mx-auto flex flex-col items-center">
      {/* Header with Original Serif Italic Styling */}
      <div className="text-center space-y-2 mb-10">
       <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
        Community Insights
       </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Real-time metrics and emotional trends across all shared moments.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-xs">Calculating metrics...</p>
        </div>
      ) : (
        <div className="w-full space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-4">
              <div className="p-3 bg-black/5 dark:bg-white/10 rounded-2xl text-black dark:text-white">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Total Moments
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.totalStories}
                </p>
              </div>
            </div>

            <div className="bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Past 7 Days
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  +{analytics.last7DaysCount}
                </p>
              </div>
            </div>

            <div className="bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                <PieIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Smile Ratio
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.smilePercentage}%
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mood Distribution */}
            <div className="bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 space-y-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Mood Breakdown
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <Smile className="w-4 h-4" /> Smile
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {analytics.smileCount} ({analytics.smilePercentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${analytics.smilePercentage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                      <Frown className="w-4 h-4" /> Sad
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {analytics.sadCount} ({analytics.sadPercentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${analytics.sadPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Mentioned People */}
            <div className="bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 space-y-6">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Most Mentioned
                </h2>
              </div>

              {analytics.topTargets.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">
                  No target mentions logged yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {analytics.topTargets.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/50 dark:bg-gray-900/40 text-xs font-medium"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-center font-bold text-gray-400">
                          #{index + 1}
                        </span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {item.name}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-bold">
                        {item.count} {item.count === 1 ? "moment" : "moments"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}