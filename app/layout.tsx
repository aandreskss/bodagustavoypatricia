import type { Metadata } from "next";
import { Inter, Montaga } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montaga = Montaga({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-montaga",
});

export const metadata: Metadata = {
  title: "The Wedding of Gustavo & Patricia",
  description: "Los invitamos a celebrar nuestra boda",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${montaga.variable}`}>
      <body>{children}</body>
    </html>
  );
}
