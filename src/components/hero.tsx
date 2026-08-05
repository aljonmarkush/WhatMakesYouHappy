"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Smile, Frown, Loader2 } from "lucide-react";

interface Story {
  id: string;
  title: string;
  content: string;
  mood: string;
  author_name: string;
  target_person?: string | null;
  image_url?: string | null;
  created_at: string;
}

export function RecentStoriesCarousel() {
  const supabase = createClient();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentStories();
  }, []);

  const fetchRecentStories = async () => {
    try {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      setStories(data || []);
    } catch (err) {
      console.error("Error fetching recent stories:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (stories.length === 0) return null;

  // Duplicate the stories array to achieve a seamless loop effect
  const duplicatedStories = [...stories, ...stories];

  return (
    <section className="w-full py-16 overflow-hidden bg-transparent">
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Recent Stories
        </h2>
      </div>

      {/* Carousel Track with Fade Edges */}
      <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <motion.div
          className="flex gap-6 w-max"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 35,
            ease: "linear" as const,
            repeat: Infinity,
            repeatType: "loop" as const,
          }}
        >
          {duplicatedStories.map((story, idx) => {
            const isSmile = story.mood?.toLowerCase().trim() === "smile" || story.mood?.toLowerCase().trim().includes("happy");

            return (
              <div
                key={`${story.id}-${idx}`}
                className="w-[350px] sm:w-[380px] bg-white dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-sm flex flex-col justify-between shrink-0"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                        isSmile
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {isSmile ? <Smile className="w-3.5 h-3.5" /> : <Frown className="w-3.5 h-3.5" />}
                      {story.mood}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(story.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {story.image_url && (
                    <div className="w-full h-40 rounded-2xl overflow-hidden bg-black/5">
                      <img
                        src={story.image_url}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug mb-1.5 truncate">
                      {story.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                      {story.content}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-gray-100 dark:border-gray-700/50 text-[11px] text-gray-500 flex justify-between">
                  <span>By: <strong className="text-gray-700 dark:text-gray-200">{story.author_name}</strong></span>
                  {story.target_person && (
                    <span>For: <strong className="text-gray-700 dark:text-gray-200">{story.target_person}</strong></span>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}