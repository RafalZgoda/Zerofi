"use client";
import { LensLoginButton } from "@/components/LensLoginButton";
import {
  LensProvider,
  FeedItem,
  ProfilePictureSet,
  ProfileOwnedByMe,
} from "@lens-protocol/react-web";
import { lensConfig } from "@/lib/lens-config";
import { useState, useEffect } from "react";
import { LensPost } from "@/components/LensPost";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/lib/utils";

export default function Social() {
  const [activeLensProfile, setActiveLensProfile] =
    useState<ProfileOwnedByMe>();

  const [lensFeed, setLensFeed] = useState([] as FeedItem[]);
  const [lensFollowersAddresses, setLensFollowersAddresses] = useState([""]);

  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  const testLens = [
    {
      root: {
        createdAt: "2023-09-23T21:50:16.000Z",
        profile: {
          name: "Test User",
          picture: {
            original: {
              url: "https://i.pravatar.cc/300",
            },
          },
        },
        metadata: {
          content:
            "Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!",
        },
      },
    },
    {
      root: {
        createdAt: "2023-09-23T21:50:16.000Z",
        profile: {
          name: "Test User",
          picture: {
            original: {
              url: "https://i.pravatar.cc/300",
            },
          },
        },
        metadata: {
          content:
            "Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!",
        },
      },
    },
    {
      root: {
        createdAt: "2023-09-23T21:50:16.000Z",
        profile: {
          name: "Test User",
          picture: {
            original: {
              url: "https://i.pravatar.cc/300",
            },
          },
        },
        metadata: {
          content:
            "Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!",
        },
      },
    },
  ];

  return (
    <div>
      <LensProvider config={lensConfig}>
        <main className="flex min-h-screen flex-col items-center">
          {/* {activeLensProfile && <LensPost profile={activeLensProfile} />} */}
          <div className="bg-bg w-6/12 rounded-2xl p-10 max-h-[600px] overflow-y-auto">
            {lensFeed.map((feedItem, i) => (
              <div
                key={i}
                className="flex  border-b-white/20 border-b py-5 text-purple-100 cursor-pointer hover:bg-white/5 transition-all px-3"
                onClick={() => {
                  router.push("/profile/" + feedItem.root.profile.ownedBy);
                }}
              >
                <img
                  className="h-12 w-12 rounded-full mr-3"
                  src={
                    (feedItem.root.profile.picture as ProfilePictureSet)
                      ?.original?.url
                  }
                />
                <div className="flex flex-col">
                  <p className="font-bold">
                    {feedItem.root.profile.name}{" "}
                    <span className="ml-1 text-xs text-gray-500 font-normal">
                      {timeAgo(feedItem.root.createdAt)}
                    </span>
                  </p>
                  <p>{feedItem.root.metadata.content}</p>
                </div>
              </div>
            ))}
            <p className="text-center text-white/90 text-sm">
              {activeLensProfile ? "No posts yet" : "Please connect to Lens"}
              {!activeLensProfile && (
                <LensLoginButton
                  setLensFeed={setLensFeed}
                  setLensFollowersAddresses={setLensFollowersAddresses}
                  activeLensProfile={activeLensProfile}
                  setActiveLensProfile={setActiveLensProfile}
                />
              )}
            </p>
          </div>
        </main>
      </LensProvider>
    </div>
  );
}
