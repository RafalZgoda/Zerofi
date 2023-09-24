import { getTotalEthValueOfFollowers } from "./getEthBalance";
import { getFollowers } from "./getFollowers";

export const getTotalValueFollowers = async (address) => {
  const followers = await getFollowers(address);
  if (!followers || followers.length) return 0;
  // console.log({ followers });
  const followerAddresses = followers.map(
    (follower) => follower.followerAddress.addresses[0]
  );
  // console.log({ followerAddresses });
  const totalValue = await getTotalEthValueOfFollowers(followerAddresses);
  return totalValue;
};

// getTotalValueFollowers("0x31304ccdd28e62ef552824db08a350d752068c39");
