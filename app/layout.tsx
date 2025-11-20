import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Memory Match Game",
  description: "A beautiful memory puzzle game with custom themes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--color-primary)]/30`}>
        <ThemeProvider>
          <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--gradient-body-from)]/20 to-[var(--gradient-body-to)] pointer-events-none" />
          <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-[var(--color-secondary)]/40 via-transparent to-transparent pointer-events-none" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
