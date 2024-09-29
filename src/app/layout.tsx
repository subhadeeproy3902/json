import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Any to JSON",
  description: "Convert any data to JSON",
  openGraph: {
    type: 'website',
    images: [
      {
        url: 'https://i.postimg.cc/6QMGNM82/914-1x-shots-so-1.webp',
        width: 1000,
        height: 600,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
