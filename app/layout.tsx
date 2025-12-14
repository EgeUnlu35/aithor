import type { Metadata } from "next";
import { Gentium_Book_Plus } from "next/font/google";
import "./globals.css";

const gentiumBookPlus = Gentium_Book_Plus({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-gentium-book-plus",
});

export const metadata: Metadata = {
  title: "Aithor - Your E-Book Library",
  description: "Read and manage your e-book collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gentiumBookPlus.variable} antialiased bg-gray-50`}
        style={{ fontFamily: 'var(--font-gentium-book-plus)' }}
      >
        <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-xl">
          {children}
        </div>
      </body>
    </html>
  );
}
