"use me";
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Simple client-side profanity filter check
const FORBIDDEN_WORDS = ["hate", "abuse", "scam", "explicit_word"];

function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN_WORDS.some((word) => lower.includes(word));
}

export async function createStory(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const mood = formData.get("mood") as "HAPPY" | "SAD";
  const category = formData.get("category") as string;
  const isAnonymous = formData.get("isAnonymous") === "true";
  const imageFile = formData.get("image") as File | null;

  if (containsProfanity(title) || containsProfanity(content)) {
    return { error: "Your post contains content that violates community guidelines." };
  }

  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("story-images")
      .upload(filePath, imageFile);

    if (uploadError) return { error: "Failed to upload image." };

    const { data: publicUrlData } = supabase.storage
      .from("story-images")
      .getPublicUrl(filePath);

    imageUrl = publicUrlData.publicUrl;
  }

  const { error } = await supabase.from("stories").insert({
    user_id: user.id,
    title,
    content,
    mood,
    category,
    is_anonymous: isAnonymous,
    image_url: imageUrl,
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/stories");
  return { success: true };
}

export async function toggleReaction(storyId: string, reactionType: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: existing } = await supabase
    .from("reactions")
    .select("id")
    .eq("story_id", storyId)
    .eq("user_id", user.id)
    .eq("type", reactionType)
    .single();

  if (existing) {
    await supabase.from("reactions").delete().eq("id", existing.id);
  } else {
    await supabase.from("reactions").insert({
      story_id: storyId,
      user_id: user.id,
      type: reactionType,
    });
  }

  revalidatePath("/");
}