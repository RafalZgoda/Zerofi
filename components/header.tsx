"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Address from "./ui/address";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import Logo from "./logo";
import { useAccount } from "wagmi";
export default function Header() {
  const router = useRouter();
  const { address } = useAccount();

  return (
    <div className="flex p-3 px-32 text-white w-full justify-between items-center">
      <Link
        href="/"
        className="flex items-center space-x-2 font-bold w-44 text-xl"
      >
        <Logo width={120} height={120} />
      </Link>
      <div className="flex gap-3">
        <Button variant={"ghost"} onClick={() => router.push("/social")}>
          Social
        </Button>
        <Button variant={"ghost"} onClick={() => router.push("/loans")}>
          Loan
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => router.push("/profile/" + address)}
        >
          Profile
        </Button>
      </div>

      <Button variant="link">
        <div className="test">
          <ConnectButton />
        </div>
      </Button>
    </div>
  );
}
