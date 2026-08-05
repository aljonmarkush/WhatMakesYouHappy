"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Smile, Frown, Loader2, Share2, Download, X } from "lucide-react";

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
  
  // Modal & Preview state
  const [previewStory, setPreviewStory] = useState<Story | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);

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

  // Helper to cleanly load images with CORS support
  const loadImage = (url: string): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      if (!url) {
        resolve(null);
        return;
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn("Failed to load image for canvas:", url);
        resolve(null);
      };
      img.src = url;
    });
  };

  // Safe round rect helper for universal canvas compatibility
  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // Generate Canvas Preview cleanly
  const handleOpenPreview = async (story: Story) => {
    setPreviewStory(story);
    setGeneratingPreview(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not initialize canvas.");

      // 1. Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, "#111827");
      bgGradient.addColorStop(1, "#1f2937");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Central Card Background
      const cardX = 90;
      const cardY = 160;
      const cardWidth = 900;
      const cardHeight = 1600;
      const radius = 40;

      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 50;
      ctx.shadowOffsetY = 25;

      ctx.fillStyle = "#ffffff";
      drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, radius);
      ctx.fill();
      ctx.restore();

      let currentY = cardY + 80;
      const textLeft = cardX + 70;
      const maxTextWidth = 760;

      // 3. Brand Header
      ctx.font = "bold 24px sans-serif";
      ctx.fillStyle = "#9ca3af";
      ctx.fillText("WHAT MAKES YOU HAPPY", textLeft, currentY);
      currentY += 50;

      // 4. Mood Badge Pill
      const isSmile = story.mood?.toLowerCase().trim() === "smile";
      ctx.fillStyle = isSmile ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.12)";
      drawRoundedRect(ctx, textLeft, currentY, 220, 50, 25);
      ctx.fill();

      ctx.font = "bold 22px sans-serif";
      ctx.fillStyle = isSmile ? "#059669" : "#d97706";
      ctx.fillText(isSmile ? "😊 Smile Moment" : "😢 Sad Moment", textLeft + 24, currentY + 32);
      currentY += 80;

      // 5. Optional Image Rendering
      if (story.image_url) {
        const loadedImg = await loadImage(story.image_url);
        if (loadedImg) {
          const imgWidth = 760;
          const imgHeight = 360;
          
          ctx.save();
          drawRoundedRect(ctx, textLeft, currentY, imgWidth, imgHeight, 20);
          ctx.clip();
          ctx.drawImage(loadedImg, textLeft, currentY, imgWidth, imgHeight);
          ctx.restore();
          
          currentY += imgHeight + 40;
        }
      }

      // 6. Title Text Wrap
      ctx.font = "bold 40px sans-serif";
      ctx.fillStyle = "#111827";
      const titleWords = story.title.split(" ");
      let titleLine = "";
      
      for (let n = 0; n < titleWords.length; n++) {
        const testLine = titleLine + titleWords[n] + " ";
        if (ctx.measureText(testLine).width > maxTextWidth && n > 0) {
          ctx.fillText(titleLine, textLeft, currentY);
          titleLine = titleWords[n] + " ";
          currentY += 50;
        } else {
          titleLine = testLine;
        }
      }
      ctx.fillText(titleLine, textLeft, currentY);
      currentY += 60;

      // 7. Body Content Text Wrap
      ctx.font = "26px sans-serif";
      ctx.fillStyle = " #4b5563";
      const contentWords = story.content.split(" ");
      let contentLine = "";

      for (let n = 0; n < contentWords.length; n++) {
        const testLine = contentLine + contentWords[n] + " ";
        if (ctx.measureText(testLine).width > maxTextWidth && n > 0) {
          ctx.fillText(contentLine, textLeft, currentY);
          contentLine = contentWords[n] + " ";
          currentY += 38;
          if (currentY > cardY + cardHeight - 100) break;
        } else {
          contentLine = testLine;
        }
      }
      ctx.fillText(contentLine, textLeft, currentY);

      // 8. Footer Author (Fixed at bottom of card)
      ctx.font = "bold 22px sans-serif";
      ctx.fillStyle = "#9ca3af";
      ctx.fillText(`Shared by: ${story.author_name}`, textLeft, cardY + cardHeight - 50);

      setPreviewDataUrl(canvas.toDataURL("image/png"));
    } catch (err) {
      console.error("Error generating preview:", err);
    } finally {
      setGeneratingPreview(false);
    }
  };

  const handleDownloadImage = () => {
    if (!previewDataUrl || !previewStory) return;
    setDownloading(true);
    try {
      const downloadLink = document.createElement("a");
      downloadLink.href = previewDataUrl;
      downloadLink.download = `story-${previewStory.id.slice(0, 6)}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleNativeShare = async () => {
    if (!previewDataUrl) return;
    try {
      const res = await fetch(previewDataUrl);
      const blob = await res.blob();
      const file = new File([blob], "story-card.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Shared Moment",
          text: "Check out this moment on What Makes You Happy!",
        });
      } else {
        handleDownloadImage();
      }
    } catch (err) {
      console.error("Native share error:", err);
      handleDownloadImage();
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
        <div className="text-center py-16 px-6 bg-gray-100/50 dark:bg-gray-800/30 rounded-3xl border border-gray-200/50 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            No moments found for this filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredStories.map((story) => {
            const isSmile = story.mood?.toLowerCase().trim() === "smile";

            return (
              <div
                key={story.id}
                className="bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm flex flex-col justify-between hover:border-gray-300 dark:hover:border-gray-600 transition-all"
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

                    {/* Share Button */}
                    <button
                      onClick={() => handleOpenPreview(story)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-all shadow-sm"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Feed Image Display */}
                  {story.image_url && (
                    <div className="w-full h-48 rounded-2xl overflow-hidden bg-black/5 border border-gray-200/40 dark:border-gray-700/40">
                      <img
                        src={story.image_url}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug mb-2">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {story.content}
                    </p>
                  </div>
                </div>

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

      {/* Preview Modal */}
      {previewStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Share Story Card</h3>
                <p className="text-xs text-gray-500">Preview & share your story image card</p>
              </div>
              <button
                onClick={() => setPreviewStory(null)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Canvas Preview Image */}
            <div className="flex-1 overflow-y-auto flex items-center justify-center bg-gray-100 dark:bg-gray-950 rounded-2xl p-4 my-2 border border-gray-200/50 dark:border-gray-800">
              {generatingPreview ? (
                <div className="flex flex-col items-center gap-2 py-12 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-xs">Generating preview card...</span>
                </div>
              ) : previewDataUrl ? (
                <img
                  src={previewDataUrl}
                  alt="Story Card Preview"
                  className="max-h-[400px] rounded-xl shadow-lg object-contain"
                />
              ) : null}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={handleDownloadImage}
                disabled={generatingPreview || downloading}
                className="py-3 px-4 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-2xl text-xs hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Download Story Image</span>
              </button>

              <button
                onClick={handleNativeShare}
                disabled={generatingPreview}
                className="py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-2xl text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via App</span>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 space-y-1">
              <p>1. Click <strong>Download Story Image</strong> to save the card.</p>
              <p>2. Open Instagram or Facebook on your device.</p>
              <p>3. Create a new Story and select your downloaded card.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}