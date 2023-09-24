import {
  useWalletLogin,
  Profile,
  ProfileId,
  FeedItem,
  useActiveProfile,
  useFeed,
  useProfileFollowers,
  ProfileOwnedByMe,
} from "@lens-protocol/react-web";
// import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { Button } from "./ui/button";
export function LensLoginButton({
  setActiveLensProfile,
  activeLensProfile,
  setLensFeed,
  setLensFollowersAddresses,
}: {
  setActiveLensProfile: (profile: ProfileOwnedByMe | null) => void;
  activeLensProfile: Profile | null;
  setLensFeed: (feed: FeedItem[]) => void;
  setLensFollowersAddresses: (addresses: string[]) => void;
}) {
  const {
    execute: login,
    error: loginError,
    isPending: isLoginPending,
  } = useWalletLogin();
  // const { ready, authenticated, logout, user } = usePrivy();
  const { data: activeProfile } = useActiveProfile();
  const { data: feedItems } = useFeed({
    profileId: activeProfile?.id || ("0x78bc" as ProfileId),
    limit: 10,
    metadataFilter: {},
  });
  const { data: followers } = useProfileFollowers({
    profileId: activeProfile?.id || ("" as ProfileId),
    limit: 10,
  });

  useEffect(() => {
    if (!activeProfile?.id || !activeProfile || !feedItems) return; // Exit if condition is not met
    const post = feedItems.filter((item) => item.root.__typename === "Post");
    setLensFeed(post);
  }, [feedItems, activeProfile?.id, setLensFeed, activeProfile]);

  useEffect(() => {
    if (!activeProfile?.id || !activeProfile || !followers) return; // Exit if condition is not met
    const followersAddresses = followers.map(
      (follower) => follower.wallet.address
    );
    setLensFollowersAddresses(followersAddresses);
  }, [followers, activeProfile?.id, setLensFollowersAddresses, activeProfile]);

  const onLoginClick = async () => {
    // const address = user?.wallet?.address;
    const address = "0x78bc";
    if (!address) return;

    const loginLensResult = await login({
      address,
    });

    if (loginLensResult) {
      const profile = loginLensResult.unwrap();
      const profileOwnedByMe = {
        ...profile,
        ownedByMe: true,
      } as ProfileOwnedByMe;
      setActiveLensProfile(profileOwnedByMe);
    }
  };

  return (
    <div>
      {/* {ready && authenticated && ( */}
        <div className="text-white font-bold p-5">
          {loginError && <p>{loginError.toString()}</p>}
          {activeLensProfile ? (
            //TODO: check si le profil est pas deja recup
            <p>Logged in as {activeLensProfile?.handle}</p>
          ) : (
            <Button disabled={isLoginPending} onClick={onLoginClick}>
              Log in with Lens
            </Button>
          )}
        </div>
      {/* )} */}
    </div>
  );
}
