"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Smile, Users, Loader2, Frown, MessageSquare, Bookmark, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const EMOJIS = ["😊", "😄", "❤️", "🌿", "✨", "☁️"];

interface Metrics {
  totalStories: number;
  smileMoments: number;
  sadMoments: number;
}

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

const carouselAnimation = {
  backgroundPosition: ["0% 0%", "-100% 0%"],
};

const carouselTransition = {
  duration: 20,
  ease: "linear" as const,
  repeat: Infinity,
  repeatType: "loop" as const,
};

export function Hero() {
  const supabase = createClient();

  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({
    totalStories: 0,
    smileMoments: 0,
    sadMoments: 0,
  });
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const totalStories = data.length;
        
        const smileMoments = data.filter((s) => {
          const m = s.mood?.toLowerCase().trim() || "";
          return m.includes("smile") || m.includes("happy");
        }).length;

        const sadMoments = data.filter((s) => {
          const m = s.mood?.toLowerCase().trim() || "";
          return m.includes("sad");
        }).length;

        setMetrics({ totalStories, smileMoments, sadMoments });

        const approvedStories = data.filter((s) => s.is_approved ?? true).slice(0, 10);
        setStories(approvedStories);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const duplicatedStories = stories.length > 0 ? [...stories, ...stories] : [];

  return (
    <section className="relative w-full flex flex-col justify-center items-center text-center px-4 pt-20 pb-16 bg-gradient-to-b from-brand-white via-amber-50/30 to-emerald-50/20 dark:from-brand-dark dark:via-gray-900 dark:to-emerald-950/20 overflow-hidden">
      {/* Floating Emojis Background */}
      {EMOJIS.map((emoji, idx) => (
        <motion.div
          key={idx}
          className="absolute text-3xl select-none pointer-events-none opacity-30"
          initial={{
            x: Math.sin(idx) * 250,
            y: Math.cos(idx) * 150,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4 + idx,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            top: `${15 + idx * 12}%`,
            left: `${10 + idx * 14}%`,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="max-w-4xl z-10 space-y-6">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-green/10 dark:bg-brand-gold/10 text-brand-green dark:text-brand-gold border border-brand-green/20 dark:border-brand-gold/20 backdrop-blur-md inline-block"
        >
          A Place for Genuine Human Moments
        </motion.span>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand-dark dark:text-brand-white"
        >
          What Makes You Happy?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
        >
          Every smile has a story. Every difficult day deserves to be heard.
          Share your moments and inspire someone today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <Link
            href="/create"
            className="w-full sm:w-auto px-8 py-3.5 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black font-semibold rounded-2xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5 text-sm"
          >
            Share Your Story
          </Link>
          <Link
            href="/stories"
            className="w-full sm:w-auto px-8 py-3.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 text-brand-dark dark:text-brand-white font-semibold rounded-2xl hover:bg-white/80 dark:hover:bg-gray-800 transition-all duration-300 text-sm"
          >
            Browse Stories
          </Link>
        </motion.div>

        {/* Dynamic Live Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 max-w-3xl mx-auto"
        >
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-800 shadow-sm flex items-center justify-center gap-3">
            <Heart className="w-5 h-5 text-rose-500" />
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin inline" />
              ) : (
                `${metrics.totalStories.toLocaleString()} Stories Shared`
              )}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-800 shadow-sm flex items-center justify-center gap-3">
            <Smile className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin inline" />
              ) : (
                `${metrics.smileMoments.toLocaleString()} Happy Moments`
              )}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-800 shadow-sm flex items-center justify-center gap-3">
            <Users className="w-5 h-5 text-indigo-500" />
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin inline" />
              ) : (
                `${metrics.sadMoments.toLocaleString()} Sad Moments`
              )}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Recent Stories Carousel Section (Using card design matching your screenshot style) */}
      <div className="w-full max-w-7xl mx-auto mt-16 z-10 px-4">
        <div className="text-left mb-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-brand-dark dark:text-brand-white">
            Recent Stories
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : stories.length === 0 ? (
          <div className="text-sm text-gray-500 py-6">No recent stories found.</div>
        ) : (
          <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <motion.div
              className="flex gap-6 w-max"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                duration: 40,
                ease: "linear" as const,
                repeat: Infinity,
                repeatType: "loop" as const,
              }}
            >
              {duplicatedStories.map((story, idx) => {
                const moodLower = story.mood?.toLowerCase().trim() || "";
                const isSmile = moodLower.includes("smile") || moodLower.includes("happy");

                return (
                  <div
                    key={`${story.id}-${idx}`}
                    className="w-[360px] bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between text-left shrink-0"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                          {isSmile ? "😊 Smile" : "🌧️ Sad"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(story.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {story.image_url && (
                        <div className="w-full h-36 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900">
                          <img
                            src={story.image_url}
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug mb-1 truncate">
                          {story.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                          {story.content}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-semibold text-[10px] text-gray-600 dark:text-gray-300">
                          {story.author_name ? story.author_name.charAt(0).toUpperCase() : "A"}
                        </span>
                        <span className="truncate max-w-[120px]">{story.author_name || "Anonymous"}</span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-400">
                        <button className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                        <button className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>

      {/* Carousel Sliding Background Effect */}
      <motion.div
        animate={carouselAnimation}
        transition={carouselTransition}
        className="absolute inset-0 z-0 opacity-30 scale-105 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            to right, 
            transparent 0%, 
            rgba(255, 255, 255, 0.5) 50%, 
            transparent 100%
          )`,
          backgroundSize: "200% 100%",
        }}
      />
    </section>
  );
}