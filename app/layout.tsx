"use client";

import Header from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivyProvider
          appId={"clmw6e8nn00agjz0fq7vpdauj"}
          onSuccess={(user) => {}}
          config={{
            loginMethods: ["email", "wallet"],
            appearance: {
              theme: "light",
              accentColor: "#676FFF",
              logo: "https://your-logo-url",
            },
          }}
        >
          <Header />
          {children}
        </PrivyProvider>
      </body>
    </html>
  );
}
