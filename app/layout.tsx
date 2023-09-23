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
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router, user]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivyProvider
          appId={"clmw6e8nn00agjz0fq7vpdauj"}
          onSuccess={(user) => {
            router.push("/loans");
          }}
          config={{
            loginMethods: ["wallet"],
            appearance: {
              theme: "light",
              accentColor: "#676FFF",
              logo: "/logo-dark.png",
            },
          }}
        >
          <Header />
          {children}
          <img
            src="/bg.svg"
            alt="bg"
            className="w-full h-full absolute top-0 opacity-25 z-[-1] object-cover"
          />
        </PrivyProvider>
      </body>
    </html>
  );
}
