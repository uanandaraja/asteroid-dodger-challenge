import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: {
    default: "Neon Noir — Arcade Dodge",
    template: "%s | Neon Noir",
  },
  description:
    "Fast-paced neon arcade game where you dodge asteroids in a relentless starfield.",
  openGraph: {
    title: "Neon Noir — Arcade Dodge",
    description:
      "Steer your ship. Dodge the asteroids. Survive the neon void.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-foreground">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
