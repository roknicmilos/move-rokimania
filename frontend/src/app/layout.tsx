import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: [ "latin" ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: [ "latin" ],
});

export const metadata: Metadata = {
  title: "Move@Rokimania",
  description: "Track your fitness activities with Move@Rokimania",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({children}: RootLayoutProps) {
  return (
    <html lang="en">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
    >
    <Navigation/>
    <main className="container mx-auto px-4 py-8 md:py-12">
      {children}
    </main>
    </body>
    </html>
  );
}