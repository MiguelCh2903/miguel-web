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
  title: "Miguel Chumacero - Ingeniero Mecatrónico | AI & Robótica",
  description:
    "Portfolio de Miguel Chumacero, ingeniero mecatrónico especializado en Computer Vision, IA Generativa y Robótica. Transformando ideas en soluciones tecnológicas innovadoras.",
  keywords: [
    "Miguel Chumacero",
    "Ingeniero Mecatrónico",
    "Computer Vision",
    "Inteligencia Artificial",
    "Robótica",
    "Machine Learning",
    "Deep Learning",
    "ROS2",
    "Python",
    "Portfolio",
  ],
  authors: [{ name: "Miguel Chumacero" }],
  creator: "Miguel Chumacero",
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: "Miguel Chumacero - Ingeniero Mecatrónico | AI & Robótica",
    description:
      "Portfolio de Miguel Chumacero, ingeniero mecatrónico especializado en Computer Vision, IA Generativa y Robótica.",
    siteName: "Miguel Chumacero Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miguel Chumacero - Ingeniero Mecatrónico | AI & Robótica",
    description: "Especializado en Computer Vision, IA Generativa y Robótica.",
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
  // Descomentar y agregar código de verificación cuando esté disponible
  // verification: {
  //   google: "tu-codigo-de-verificacion",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://api.groq.com" />
        <link rel="preconnect" href="https://api.groq.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
