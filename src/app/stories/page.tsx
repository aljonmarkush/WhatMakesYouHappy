"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Smile, Frown, Loader2, Calendar, User, Heart } from "lucide-react";

interface Story {
  id: string;
  title: string;
  content: string;
  mood: "Smile" | "Sad";
  author_name: string;
  target_person?: string | null;
  image_url?: string | null;
  created_at: string;
}

export default function StoriesPage() {
  const supabase = createClient();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"All" | "Smile" | "Sad">("All");

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (err) {
      console.error("Error fetching stories:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStories = stories.filter((story) => {
    if (activeFilter === "All") return true;
    return story.mood === activeFilter;
  });

  return (
    <div className="min-h-screen py-12 px-4 max-w-6xl mx-auto flex flex-col items-center">
      {/* Page Title */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
          Shared Moments
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
          Explore anonymous stories shared by people around the world.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-200/70 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl mb-10">
        {(["All", "Smile", "Sad"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeFilter === filter
                ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-xs">Fetching latest moments...</p>
        </div>
      ) : filteredStories.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 px-6 bg-gray-100/50 dark:bg-gray-800/30 rounded-3xl border border-gray-200/50 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            No moments found for this filter.
          </p>
        </div>
      ) : (
        /* Masonry / Grid Display */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm flex flex-col justify-between hover:border-gray-300 dark:hover:border-gray-600 transition-all"
            >
              <div className="space-y-4">
                {/* Header: Mood Tag & Date */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                      story.mood === "Smile"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {story.mood === "Smile" ? (
                      <Smile className="w-3.5 h-3.5" />
                    ) : (
                      <Frown className="w-3.5 h-3.5" />
                    )}
                    {story.mood}
                  </span>

                  <span className="text-[10px] text-gray-400">
                    {new Date(story.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Optional Image */}
                {story.image_url && (
                  <div className="w-full h-48 rounded-2xl overflow-hidden bg-black/5">
                    <img
                      src={story.image_url}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Title & Body Content */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug mb-2">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {story.content}
                  </p>
                </div>
              </div>

              {/* Footer Details */}
              <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center text-[11px] text-gray-500 dark:text-gray-400">
                <span>By: <strong className="text-gray-700 dark:text-gray-200">{story.author_name}</strong></span>
                {story.target_person && (
                  <span>For: <strong className="text-gray-700 dark:text-gray-200">{story.target_person}</strong></span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}