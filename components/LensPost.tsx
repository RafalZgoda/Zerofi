import {
  ContentFocus,
  CollectPolicyType,
  ProfileOwnedByMe,
  ReferencePolicyType,
  useCreatePost,
} from "@lens-protocol/react";
import { uploadJson } from "@/lib/upload-ipfs";
import { useState } from "react";
export function LensPost({ profile }: { profile: ProfileOwnedByMe }) {
  const [contentValue, setContentValue] = useState("");
  const {
    execute: create,
    error,
    isPending,
  } = useCreatePost({ publisher: profile, upload: uploadJson });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createLensPost(contentValue);
  };

  const createLensPost = async (content: string) => {
    const postCreated = await create({
      content,
      contentFocus: ContentFocus.TEXT_ONLY,
      locale: "en",
      collect: {
        type: CollectPolicyType.NO_COLLECT,
      },
      reference: {
        type: ReferencePolicyType.ANYONE,
      },
    });
    setContentValue("");
    //TODO: refresh ou aller au post
  };

  return (
    <div>
      <form onSubmit={(event) => handleSubmit(event)}>
        <textarea
          value={contentValue}
          onChange={(event) => setContentValue(event.target.value)}
        ></textarea>
        <button>Post</button>
      </form>
    </div>
  );
}
