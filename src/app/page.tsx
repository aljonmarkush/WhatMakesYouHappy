import { Hero } from "@/components/hero";

export const revalidate = 60;

export default function HomePage() {
  return (
    <main className="w-full flex flex-col">
      <Hero />
    </main>
  );
}