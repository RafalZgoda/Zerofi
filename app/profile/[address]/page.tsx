"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUserOnChainData } from "@/lib/next-id";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Profile({ params }: { params: { address: string } }) {
  const [profile, setProfile] = useState<any>();

  const getUser = async (address: string) => {
    const response = await getUserOnChainData(address);
    console.log(response);
    setProfile(response);
  };

  useEffect(() => {
    getUser(params.address);
  }, [params]);

  return (
    <div className="p-10 bg-bg w-6/12 mx-auto rounded-3xl mt-5">
      {!profile && (
        <Loader2 className="block mx-auto animate-spin text-white" />
      )}
      {profile && (
        <div className="flex justify-between gap-10 items-center flex-wrap ">
          <div className="w-full glass px-10 py-5 flex justify-between rounded-[50px] items-center text-white">
            <div>
              <h1 className="m-0 p-0 flex items-center mb-1">
                {profile?.ENS}
                {profile?.ENS && (
                  <svg
                    onClick={() =>
                      window.open("https://web3.bio/" + profile.ENS)
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="ml-3 w-4 h-4 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                )}
              </h1>
              <p className="m-0 p-0 flex items-center text-sm">
                {true && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Image
                          src={"/wld.png"}
                          className="w-5 mr-1 object-contain"
                          width={64}
                          height={64}
                          alt={profile.source}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Verified with Worldcoin</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {profile?.identity}
              </p>
            </div>
            <div className="text-center">
              <h1 className="font-bold text-2xl">287</h1>
              <p>SCORE</p>
            </div>
          </div>
        </div>
      )}

      {profile && (
        <div className="flex text-white gap-5 p-5 justify-center items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant={"secondary"} className="w-32">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Trust</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant={"destructive"} className="w-32">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z"
                    />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-red-500 text-white">
                <p>Distrust</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      {profile && profile?.neighbors.length > 0 && (
        <h1 className="text-white text-center text-lg font-bold mb-3">
          Social Identities
        </h1>
      )}
      {profile?.neighbors.map((neighbor: any, index: number) => {
        return (
          <div
            key={index}
            className="mb-3 glass text-white w-full px-10 py-5 flex rounded-[50px]"
          >
            {/* <Image
              src={"/img/" + neighbor.source + ".png"}
              className="w-16 mr-3 object-contain"
              width={64}
              height={64}
              alt={neighbor.source}
            /> */}
            <div className="flex justify-between w-full text-sm items-center">
              <h1 className="m-0 p-0">{neighbor.displayName || "Display"}</h1>
              <p className="m-0 p-0 ">{neighbor.identity}</p>
              <p className="m-0 p-0 flex-col flex text-center">
                <span className="font-bold text-xs">Platform</span>{" "}
                {neighbor.source}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
