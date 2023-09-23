"use client";
import { LensLoginButton } from "@/components/LensLoginButton";
import {
  LensProvider,
  Profile,
  FeedItem,
  ProfilePictureSet,
  ProfileOwnedByMe
} from "@lens-protocol/react-web";
import { useLensConfig } from "@/lib/lens-config";
import { useState, useEffect } from "react";
import { LensPost } from "@/components/LensPost";
export default function Social() {
  const lensConfig = useLensConfig();
  const [activeLensProfile, setActiveLensProfile] = useState(
    null as ProfileOwnedByMe | null
  );
  const [lensFeed, setLensFeed] = useState([] as FeedItem[]);
  const [lensFollowersAddresses, setLensFollowersAddresses] = useState([""]);
  if (!lensConfig) return;

  return (
    <div>
      <LensProvider config={lensConfig}>
        <main className="flex min-h-screen flex-col items-center p-24">
          <h1>Social</h1>
          <LensLoginButton
            setActiveLensProfile={setActiveLensProfile}
            activeLensProfile={activeLensProfile}
            setLensFeed={setLensFeed}
            setLensFollowersAddresses={setLensFollowersAddresses}
          />
          <div>
            {activeLensProfile && <LensPost profile={activeLensProfile} />}
            <h2>Feed</h2>
            {lensFeed.map((feedItem, i) => (
              <div key={i}>
                <div className="flex">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={
                      (feedItem.root.profile.picture as ProfilePictureSet)
                        ?.original?.url
                    }
                  />
                  <p>{feedItem.root.profile.name}</p>
                </div>

                <p>{feedItem.root.metadata.content}</p>
              </div>
            ))}
          </div>
        </main>
      </LensProvider>
    </div>
  );
}
