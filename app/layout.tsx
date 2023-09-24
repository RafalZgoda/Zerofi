"use client";

import Header from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // useEffect(() => {
  //   if (ready && !authenticated) {
  //     router.push("/");
  //   }
  // }, [ready, authenticated, router, user]);

  return (
    <html lang="en">
      <body className={inter.className}>
          <Header />
          {children}
          <img
            src="/bg.svg"
            alt="bg"
            className="w-full h-full absolute top-0 opacity-25 z-[-1] object-cover"
          />
        <Toaster />
      </body>
    </html>
  );
}
