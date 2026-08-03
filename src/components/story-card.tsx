"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Bookmark, Share2, MessageCircle } from "lucide-react";
import { useState } from "react";

interface StoryProps {
  story: {
    id: string;
    title: string;
    content: string;
    image_url?: string;
    mood: "HAPPY" | "SAD";
    category: string;
    is_anonymous: boolean;
    profiles?: { full_name: string; avatar_url: string };
    created_at: string;
  };
}

export function StoryCard({ story }: StoryProps) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="break-inside-avoid mb-6 rounded-3xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {story.image_url && (
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={story.image_url}
            alt={story.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              story.mood === "HAPPY"
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            }`}
          >
            {story.mood === "HAPPY" ? "😊 Happy" : "😔 Sad"} • {story.category}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(story.created_at).toLocaleDateString()}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
          {story.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
          {story.content}
        </p>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-200">
              {story.is_anonymous ? "A" : story.profiles?.full_name?.[0] || "U"}
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {story.is_anonymous ? "Anonymous" : story.profiles?.full_name || "User"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <button
              onClick={() => setLiked(!liked)}
              className={`p-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ${
                liked ? "text-rose-500" : ""
              }`}
            >
              <Heart className="w-4 h-4" fill={liked ? "currentColor" : "none"} />
            </button>
            <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}