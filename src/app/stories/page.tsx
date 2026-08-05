"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Smile, Users, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const EMOJIS = ["😊", "😄", "❤️", "🌿", "✨", "☁️"];

interface Metrics {
  totalStories: number;
  smileMoments: number;
  sadMoments: number;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("stories")
        .select("*");

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
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <section className="relative w-full flex flex-col justify-center items-center text-center px-4 pt-20 pb-20 bg-gradient-to-b from-brand-white via-amber-50/30 to-emerald-50/20 dark:from-brand-dark dark:via-gray-900 dark:to-emerald-950/20 overflow-hidden">
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
          className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-6 max-w-3xl mx-auto"
        >
          <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-800 shadow-sm flex items-center justify-center gap-3">
            <Heart className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin inline" />
              ) : (
                `${metrics.totalStories.toLocaleString()} Stories Shared`
              )}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-800 shadow-sm flex items-center justify-center gap-3">
            <Smile className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin inline" />
              ) : (
                `${metrics.smileMoments.toLocaleString()} Happy Moments`
              )}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-gray-800 shadow-sm flex items-center justify-center gap-3">
            <Users className="w-4 h-4 text-indigo-500" />
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