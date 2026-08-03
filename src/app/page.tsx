import { Hero } from "@/components/hero";
import { StoryCard } from "@/components/story-card";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: stories } = await supabase
    .from("stories")
    .select("*, profiles(full_name, avatar_url)")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(12);

  const hasStories = stories && stories.length > 0;

  return (
    <main className="w-full flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Main Content Section */}
      <section className="w-full bg-brand-white dark:bg-brand-dark py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto space-y-8">
          {hasStories ? (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Recent Stories
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            </>
          ) : (
            /* Empty State Container */
            <div className="text-center py-12 px-4 max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                No stories published yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Be the first person to share a moment and light up this feed!
              </p>
              <div className="pt-2">
                <Link
                  href="/create"
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-xl text-xs hover:opacity-90 transition-opacity"
                >
                  Share the First Story
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}