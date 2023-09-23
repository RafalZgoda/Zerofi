"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Address from "./ui/address";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import Logo from "./logo";
export default function Header() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const router = useRouter();

  return (
    <div className="flex p-3 px-32 text-white w-full justify-between">
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
      </div>
      <div className="w-48">
        {!ready && <Loader2 className="animate-spin" />}
        {ready && !authenticated && (
          <Button onClick={login}>Connect Wallet</Button>
        )}
        {ready && authenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Button>
                <Address address={user?.wallet?.address || ""} />{" "}
                <ChevronDown className="w-5 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white/20 text-white p-3 text-sm">
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={() => router.push("/profile/" + user?.wallet?.address)}
                className="hover:opacity-80 cursor-pointer hover:border-none focus-visible:border-none focus-visible:outline-none"
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem
                onClick={logout}
                className="hover:opacity-80 cursor-pointer hover:border-none focus-visible:border-none focus-visible:outline-none"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
