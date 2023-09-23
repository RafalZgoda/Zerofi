"use client";
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  const getStarted = () => {
    if (ready && !authenticated) {
      login();
    }
    if (ready && authenticated) {
      router.push("/loans");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-150px)] flex-col items-center justify-center text-white">
      <h1 className="font-bold text-6xl mb-3">
        Instant loans with no collaterals
      </h1>
      <p className="italic">Your network is your networth</p>
      <div className="flex gap-3">
        <Button onClick={getStarted} variant={"secondary"} className="mt-5">
          Get Started
        </Button>
        <Button onClick={getStarted} className="mt-5">
          Learn More
        </Button>
      </div>
    </main>
  );
}
