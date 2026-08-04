"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Smile, Frown, Loader2, Download, Share2 } from "lucide-react";

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

export default function StoriesPage() {
  const supabase = createClient();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"All" | "Smile" | "Sad">("All");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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
    const storyMood = story.mood?.toLowerCase().trim() || "";
    const filterMood = activeFilter.toLowerCase().trim();
    return storyMood === filterMood;
  });

  // Function to generate a downloadable story image for IG/FB stories
  const handleDownloadStoryCard = async (story: Story) => {
    setDownloadingId(story.id);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080; // Standard Instagram / Facebook Story width
      canvas.height = 1920; // Standard Instagram / Facebook Story height
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // 1. Draw Background Gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#f9fafb");
      gradient.addColorStop(1, "#e5e7eb");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Central Card Background
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 20;
      
      const cardX = 90;
      const cardY = 360;
      const cardWidth = 900;
      const cardHeight = 1200;
      const radius = 40;

      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardWidth, cardHeight, radius);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // 3. Draw Brand Watermark / Header inside card
      ctx.font = "bold 32px sans-serif";
      ctx.fillStyle = "#111827";
      ctx.fillText("What Makes You Happy", cardX + 60, cardY + 90);

      // 4. Draw Mood Badge Pill
      const isSmile = story.mood?.toLowerCase().trim() === "smile";
      ctx.fillStyle = isSmile ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)";
      ctx.beginPath();
      ctx.roundRect(cardX + 60, cardY + 130, 180, 50, 25);
      ctx.fill();

      ctx.font = "bold 24px sans-serif";
      ctx.fillStyle = isSmile ? "#059669" : "#d97706";
      ctx.fillText(isSmile ? "😊 Smile Moment" : "😢 Sad Moment", cardX + 85, cardY + 163);

      // 5. Draw Story Title
      ctx.font = "bold 52px sans-serif";
      ctx.fillStyle = "#111827";
      
      // Word wrap title
      const titleWords = story.title.split(" ");
      let titleLine = "";
      let titleY = cardY + 260;
      for (let n = 0; n < titleWords.length; n++) {
        const testLine = titleLine + titleWords[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 780 && n > 0) {
          ctx.fillText(titleLine, cardX + 60, titleY);
          titleLine = titleWords[n] + " ";
          titleY += 65;
        } else {
          titleLine = testLine;
        }
      }
      ctx.fillText(titleLine, cardX + 60, titleY);

      // 6. Draw Story Content Body
      ctx.font = "32px sans-serif";
      ctx.fillStyle = "#4b5563";
      let contentY = titleY + 80;
      const words = story.content.split(" ");
      let line = "";
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 780 && n > 0) {
          ctx.fillText(line, cardX + 60, contentY);
          line = words[n] + " ";
          contentY += 50;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, cardX + 60, contentY);

      // 7. Draw Footer Author details
      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = "#9ca3af";
      ctx.fillText(`Shared by: ${story.author_name}`, cardX + 60, cardY + cardHeight - 80);

      // 8. Convert Canvas to Downloadable Image Link
      const imageURI = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = imageURI;
      downloadLink.download = `story-${story.id.slice(0, 6)}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error("Error generating story image:", err);
      alert("Failed to export story card image.");
    } finally {
      setDownloadingId(null);
    }
  };

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
        /* Grid Display */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredStories.map((story) => {
            const isSmile = story.mood?.toLowerCase().trim() === "smile";
            const isDownloading = downloadingId === story.id;

            return (
              <div
                key={story.id}
                className="bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm flex flex-col justify-between hover:border-gray-300 dark:hover:border-gray-600 transition-all"
              >
                <div className="space-y-4">
                  {/* Header: Mood Tag & IG Story Export Button */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                        isSmile
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {isSmile ? (
                        <Smile className="w-3.5 h-3.5" />
                      ) : (
                        <Frown className="w-3.5 h-3.5" />
                      )}
                      {story.mood}
                    </span>

                    {/* Instagram/Facebook Story Export Button */}
                    <button
                      onClick={() => handleDownloadStoryCard(story)}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-all shadow-sm disabled:opacity-50"
                      title="Download image formatted for Instagram & Facebook Stories"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Download className="w-3 h-3" />
                      )}
                      <span>Story Image</span>
                    </button>
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
            );
          })}
        </div>
      )}
    </div>
  );
}