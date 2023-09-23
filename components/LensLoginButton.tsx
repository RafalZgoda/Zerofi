import {
  useWalletLogin,
  Profile,
  ProfileId,
  FeedItem,
  useActiveProfile,
  useFeed,
  useProfileFollowers,
  ProfileOwnedByMe,
  usePublications,
  Post,
} from "@lens-protocol/react-web";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import _ from "lodash";
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
  const { ready, authenticated, user } = usePrivy();
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
  const { data: ownItems } = usePublications({
    profileId: activeProfile?.id || ("" as ProfileId),
    limit: 1, // demo purpose
  });

  useEffect(() => {
    if (!activeProfile?.id || !activeProfile) return; // Exit if condition is not met
    let allFeedPosts = [] as FeedItem[];
    if (feedItems) {
      feedItems.forEach((item) => {
        if (item.root.__typename === "Post") {
          allFeedPosts.push(item);
        }
      });
    }
    if (ownItems) {
      (ownItems as Post[]).forEach((item) => {
        if (item?.__typename === "Post") {
          const feedItem = {
            root: item,
          } as unknown as FeedItem;
          allFeedPosts.push(feedItem);
        }
      });
    }
    allFeedPosts = _.orderBy(allFeedPosts, ["root.createdAt"], ["desc"]);
    setLensFeed(allFeedPosts);
  }, [feedItems, activeProfile?.id, setLensFeed, activeProfile, ownItems]);

  useEffect(() => {
    if (!activeProfile?.id || !activeProfile || !followers) return; // Exit if condition is not met
    const followersAddresses = followers.map(
      (follower) => follower.wallet.address
    );
    setLensFollowersAddresses(followersAddresses);
  }, [followers, activeProfile?.id, setLensFollowersAddresses, activeProfile]);

  const onLoginClick = async () => {
    const address = user?.wallet?.address;
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
      {ready && authenticated && (
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
      )}
    </div>
  );
}
