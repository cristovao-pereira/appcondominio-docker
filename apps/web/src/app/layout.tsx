import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { PlatformLayout } from "@/components/PlatformLayout";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Concierge OS — The Obsidian",
  description: "Sistema de Portaria e Rastreamento GPS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${inter.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground">
        <PlatformLayout>
          {children}
        </PlatformLayout>
      </body>
    </html>
  );
}
