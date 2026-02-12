import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Miguel Chumacero - Desarrollador de Software | IA & Robótica",
  description:
    "Portfolio de Miguel Chumacero, Desarrollador de Software especializado en Inteligencia Artificial, Computer Vision y Sistemas Autónomos. Soluciones de IA en producción.",
  keywords: [
    "Miguel Chumacero",
    "Desarrollador de Software",
    "Inteligencia Artificial",
    "Computer Vision",
    "Machine Learning",
    "Deep Learning",
    "LLMs",
    "Agentes IA",
    "Python",
    "Robótica",
    "Portfolio",
  ],
  authors: [{ name: "Miguel Chumacero" }],
  creator: "Miguel Chumacero",
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: "Miguel Chumacero - Desarrollador de Software | IA & Robótica",
    description:
      "Portfolio de Miguel Chumacero, Desarrollador de Software especializado en IA, Computer Vision y Sistemas Autónomos.",
    siteName: "Miguel Chumacero Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miguel Chumacero - Desarrollador de Software | IA & Robótica",
    description: "Especializado en Inteligencia Artificial, Computer Vision y Sistemas Autónomos.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://api.openai.com" />
        <link rel="preconnect" href="https://api.openai.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dot-pattern`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
