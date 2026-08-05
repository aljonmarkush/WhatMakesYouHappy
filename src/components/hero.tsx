"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Smile, Users, Loader2, Frown } from "lucide-react";
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
      // Fetch metrics and recent stories simultaneously
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

        // Filter approved or just use the latest ones (limit to 6 for the carousel)
        const approvedStories = data.filter((s) => s.is_approved ?? true).slice(0, 6);
        setStories(approvedStories);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  // Duplicate stories array to create a seamless infinite marquee animation loop
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

      {/* Recent Stories Marquee Carousel Section */}
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
                duration: 35,
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
                    className="w-[350px] sm:w-[380px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-sm flex flex-col justify-between text-left shrink-0"
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