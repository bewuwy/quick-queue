import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ListOrdered } from "lucide-react";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickQueue",
  description: "QuickQueue",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <header className="bg-blue-400 text-white p-4 flex items-center">
            <ListOrdered className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">QuickQueue</h1>
          </header>
        </div>
        <main className="m-8 mx-6 flex-grow flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
