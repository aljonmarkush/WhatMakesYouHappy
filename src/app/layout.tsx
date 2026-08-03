import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Add curly braces around Navbar and Footer here:
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "What Makes You Happy? — Share Moments & Inspire Kindness",
  description: "A minimal, heartwarming platform to express happy moments and find comfort on difficult days.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-brand-white dark:bg-brand-dark text-gray-900 dark:text-gray-100 antialiased selection:bg-brand-gold/30`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}