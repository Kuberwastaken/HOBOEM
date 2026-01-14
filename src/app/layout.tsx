import type { Metadata } from "next";
import { IBM_Plex_Mono, Share_Tech_Mono, DM_Sans } from "next/font/google";
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

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hoboem.com"),
  title: {
    default: "HOBOEM - Premium Fashion & Accessories",
    template: "%s | HOBOEM",
  },
  description: "Discover HOBOEM's curated collection of premium watches, belts, sunglasses, and lingerie. Quality craftsmanship meets timeless design. Shop authentic luxury accessories online.",
  keywords: [
    "HOBOEM",
    "premium fashion",
    "luxury accessories",
    "designer watches",
    "leather belts",
    "sunglasses",
    "lingerie",
    "fashion accessories",
    "premium watches",
    "designer belts",
    "luxury sunglasses",
    "quality fashion",
    "authentic accessories",
    "online fashion store",
    "India fashion",
  ],
  authors: [{ name: "HOBOEM" }],
  creator: "HOBOEM",
  publisher: "HOBOEM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://hoboem.com",
    siteName: "HOBOEM",
    title: "HOBOEM - Premium Fashion & Accessories",
    description: "Discover HOBOEM's curated collection of premium watches, belts, sunglasses, and lingerie. Quality craftsmanship meets timeless design.",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "HOBOEM Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HOBOEM - Premium Fashion & Accessories",
    description: "Discover HOBOEM's curated collection of premium watches, belts, sunglasses, and lingerie.",
    images: ["/favicon.png"],
    creator: "@hoboem",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [
      { url: "/favicon.png", type: "image/png" },
    ],
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  alternates: {
    canonical: "https://hoboem.com",
  },
};

import { CartProvider } from "@/context/cart-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://hoboem.com" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${ibmPlexMono.variable} ${shareTechMono.variable} ${dmSans.variable} font-mono antialiased bg-white text-black`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
