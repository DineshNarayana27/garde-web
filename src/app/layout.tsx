import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Garde | Independent Film Platform",
  description: "Every story deserves to be seen. Join the independent film revolution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans bg-background text-white antialiased animate-fade-in">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
