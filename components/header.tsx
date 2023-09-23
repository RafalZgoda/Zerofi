"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { LoaderIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
export default function Header() {
  const { ready, authenticated, login, logout, user } = usePrivy();

  return (
    <div className="flex p-3 px-32 text-white w-full justify-between">
      <Link href="/" className="flex items-center space-x-2 font-bold">
        ZeroFi
      </Link>
      <div className="flex gap-3">
        <Button variant={"ghost"}>DeFi</Button>
        <Button variant={"ghost"}>Social</Button>
      </div>
      <div>
        {!ready && <LoaderIcon className="animate-spin" />}
        {ready && !authenticated && (
          <Button variant={"ghost"} onClick={login}>
            Connect Wallet
          </Button>
        )}
        {ready && authenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              {user?.wallet?.address || user?.email?.address || "Account"}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem> */}

              <Button variant={"ghost"} onClick={logout}>
                Logout
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
