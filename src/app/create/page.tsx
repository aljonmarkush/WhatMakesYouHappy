"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImagePlus, CheckCircle2, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateStoryPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mood, setMood] = useState<"Smile" | "Sad">("Smile");
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [targetName, setTargetName] = useState("");
  const [description, setDescription] = useState("");
  
  // Image Upload States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Remove Selected Image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.length < 3 || description.length < 3) return;

    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      let imageUrl: string | null = null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Updated to use your correct storage bucket name: "story-images"
        const { error: uploadError } = await supabase.storage
          .from("story-images")
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("story-images")
          .getPublicUrl(filePath);
          
        imageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("stories").insert([
        {
          title,
          content: description,
          mood,
          author_name: authorName.trim() || "Anonymous",
          target_person: targetName.trim() || null,
          image_url: imageUrl,
          is_approved: true,
        },
      ]);

      if (error) throw error;

      setStatus("success");
      setTimeout(() => {
        router.push("/stories");
      }, 1500);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full pt-8 sm:pt-28 pb-36 px-4 flex flex-col items-center">
      {/* Header aligned neatly under navbar */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
          Share Your Moment
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Express your feelings freely. No sign up required, completely anonymous.
        </p>
      </div>

      {/* Main Form Block (Large & Roomy) */}
      <div className="w-full max-w-3xl bg-gray-100/80 dark:bg-gray-800/60 backdrop-blur-lg p-8 sm:p-10 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top Row: Mood & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Mood Selector */}
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-600 dark:text-gray-300 uppercase mb-2.5">
                CURRENT VIBE <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-200/70 dark:bg-gray-900/50 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setMood("Smile")}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    mood === "Smile"
                      ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  Smile
                </button>
                <button
                  type="button"
                  onClick={() => setMood("Sad")}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    mood === "Sad"
                      ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  Sad
                </button>
              </div>
            </div>

            {/* Title Input */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-bold tracking-wider text-gray-600 dark:text-gray-300 uppercase">
                  HEADLINE <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-gray-400">
                  {title.length}/30 (min 3)
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={30}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Someone paid for my coffee"
                className="w-full px-4 py-3 rounded-2xl border-0 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none"
              />
            </div>
          </div>

          {/* Middle Row: Names & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Optional Names Stack */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <label className="text-xs font-bold tracking-wider text-gray-600 dark:text-gray-300 uppercase">
                    POSTED BY <span className="text-gray-400 font-normal">(OPTIONAL)</span>
                  </label>
                  <span className="text-xs text-gray-400">
                    {authorName.length}/25
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={25}
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Leave blank for Anonymous"
                  className="w-full px-4 py-3 rounded-2xl border-0 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <label className="text-xs font-bold tracking-wider text-gray-600 dark:text-gray-300 uppercase">
                    DEDICATED TO <span className="text-gray-400 font-normal">(OPTIONAL)</span>
                  </label>
                  <span className="text-xs text-gray-400">
                    {targetName.length}/25
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={25}
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  placeholder="e.g. Kind Stranger / Bus Driver"
                  className="w-full px-4 py-3 rounded-2xl border-0 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none"
                />
              </div>
            </div>

            {/* Description Area */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-bold tracking-wider text-gray-600 dark:text-gray-300 uppercase">
                  WHAT HAPPENED? <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-gray-400">
                  {description.length}/200 (min 3)
                </span>
              </div>
              <textarea
                required
                rows={4}
                maxLength={200}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share the details... Small acts often leave big impacts!"
                className="w-full flex-1 px-4 py-3.5 rounded-2xl border-0 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none resize-none"
              />
            </div>
          </div>

          {/* Attach Photo Field */}
          <div>
            <label className="block text-xs font-bold tracking-wider text-gray-600 dark:text-gray-300 uppercase mb-2.5">
              ADD PHOTO <span className="text-gray-400 font-normal">(OPTIONAL)</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp, image/gif"
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-black/5 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Selected preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 group"
              >
                <ImagePlus className="w-6 h-6 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Click to add an image (PNG, JPEG, WebP, GIF)
                </span>
              </div>
            )}
          </div>

          {/* Status Banners */}
          {status === "success" && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Success! Redirecting to stories...</span>
            </div>
          )}

          {status === "error" && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || title.length < 3 || description.length < 3}
            className="w-full py-4 rounded-2xl bg-gray-600 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-white text-white dark:text-black font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Moment"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}