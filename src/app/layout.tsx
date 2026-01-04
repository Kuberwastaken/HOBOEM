import type { Metadata } from "next";
import { IBM_Plex_Mono, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YZY",
  description: "YEEZY",
};

import { CartProvider } from "@/context/cart-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexMono.variable} ${shareTechMono.variable} font-mono antialiased bg-white text-black`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
