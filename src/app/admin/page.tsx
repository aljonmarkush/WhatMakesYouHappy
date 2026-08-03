"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Smile,
  Frown,
  CheckCircle2,
  Trash2,
  Clock,
  Loader2,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

interface Story {
  id: string;
  title: string;
  content: string;
  mood: "Smile" | "Sad";
  author_name: string;
  target_person?: string | null;
  image_url?: string | null;
  is_approved: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const supabase = createClient();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Approval Status
  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    setActionLoading(id);
    try {
      const { error } = await supabase
        .from("stories")
        .update({ is_approved: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setStories((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_approved: !currentStatus } : s))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Story
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this moment permanently?")) return;

    setActionLoading(id);
    try {
      const { error } = await supabase.from("stories").delete().eq("id", id);
      if (error) throw error;

      setStories((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete story:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Metrics
  const pendingStories = stories.filter((s) => !s.is_approved);
  const approvedStories = stories.filter((s) => s.is_approved);
  const smileCount = stories.filter((s) => s.mood === "Smile").length;
  const sadCount = stories.filter((s) => s.mood === "Sad").length;

  const displayedStories = activeTab === "pending" ? pendingStories : approvedStories;

  return (
    <div className="min-h-screen py-12 px-4 max-w-6xl mx-auto flex flex-col items-center">
      {/* Header — Clean Modern Sans-Serif */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage submissions, moderate content, and review community stats.
          </p>
        </div>

        <Link
          href="/stories"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-200/80 dark:bg-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
        >
          <span>Live Feed</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8">
        <div className="bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg p-5 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{pendingStories.length}</p>
          </div>
        </div>

        <div className="bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg p-5 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Approved</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{approvedStories.length}</p>
          </div>
        </div>

        <div className="bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg p-5 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Smile className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Smiles</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{smileCount}</p>
          </div>
        </div>

        <div className="bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg p-5 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl">
            <Frown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sads</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{sadCount}</p>
          </div>
        </div>
      </div>

      {/* Moderation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-200/70 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl mb-8 self-start">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "pending"
              ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          }`}
        >
          Needs Review ({pendingStories.length})
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "approved"
              ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          }`}
        >
          Approved ({approvedStories.length})
        </button>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-xs">Loading records...</p>
        </div>
      ) : displayedStories.length === 0 ? (
        <div className="w-full text-center py-16 px-6 bg-gray-100/50 dark:bg-gray-800/30 rounded-3xl border border-gray-200/50 dark:border-gray-800">
          <ShieldAlert className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            No moments found in standard {activeTab} view.
          </p>
        </div>
      ) : (
        <div className="w-full space-y-4">
          {displayedStories.map((story) => (
            <div
              key={story.id}
              className="bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      story.mood === "Smile"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {story.mood}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(story.created_at).toLocaleString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {story.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {story.content}
                </p>

                <div className="flex gap-4 text-[11px] text-gray-500 dark:text-gray-400 pt-1">
                  <span>Author: <strong className="text-gray-700 dark:text-gray-200">{story.author_name}</strong></span>
                  {story.target_person && (
                    <span>Target: <strong className="text-gray-700 dark:text-gray-200">{story.target_person}</strong></span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => handleToggleApproval(story.id, story.is_approved)}
                  disabled={actionLoading === story.id}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    story.is_approved
                      ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  {actionLoading === story.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : story.is_approved ? (
                    "Unpublish"
                  ) : (
                    "Approve"
                  )}
                </button>

                <button
                  onClick={() => handleDelete(story.id)}
                  disabled={actionLoading === story.id}
                  className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-all"
                  title="Delete Story"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}