import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPARK — Don't Let the World Blow Out Your Spark",
  description: "The Children's Health Empowerment Platform. Personalized storybooks, brave badges, and a world where every kid's condition makes them a hero. Free. Always.",
  keywords: ["children", "health", "empowerment", "storybook", "kids", "disability", "chronic illness", "brave"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        {children}
        <footer className="mt-auto border-t border-spark/20 py-8 px-6 text-center no-print">
          <p className="font-display text-sm text-text-light">SPARK is free. It will always be free.</p>
          <p className="text-xs text-text-muted mt-1">A Vilmure Ventures Platform · Built with love by a human and an AI</p>
          <p className="text-xs text-text-muted mt-1 italic">&ldquo;For the 5-year-old in the hospital bed.&rdquo;</p>
        </footer>
      </body>
    </html>
  );
}
