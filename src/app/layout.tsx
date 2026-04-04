import type { Metadata } from "next";
import { Playfair_Display, Inter, Vazirmatn } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ContentProvider } from "@/context/ContentContext";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
  display: "swap",
});

const vazirmatn = Vazirmatn({ 
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

import { ThemeProvider } from "@/components/layout/ThemeProvider";

export const metadata: Metadata = {
  title: "Kasra Padyab | Architect & Designer",
  description: "Portfolio of Kasra Padyab, an international architect and designer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${inter.variable} ${vazirmatn.variable}`}>
      <body suppressHydrationWarning className="bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 antialiased overflow-x-hidden selection:bg-neutral-200 dark:selection:bg-neutral-800 selection:text-black dark:selection:text-white transition-colors duration-500">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
          <ContentProvider>
            <LanguageProvider>
              <SmoothScroll>
                <CustomCursor />
                {children}
              </SmoothScroll>
            </LanguageProvider>
          </ContentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
