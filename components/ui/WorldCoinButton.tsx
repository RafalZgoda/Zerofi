import { CredentialType, IDKitWidget } from "@worldcoin/idkit";
import axios from "axios";

let address: any = null;

const onSuccess = async (response: any) => {
  console.log({ response });
};

const handleVerify = async (response: any) => {
  await axios.post("/api/worldcoin-verify", { ...response, address });
};

export default function WorldcoinButton({ signer }: { signer: any }) {
  address = signer._address;
  if (process.env.NEXT_PUBLIC_WLD_APP_ID === undefined)
    throw new Error("NEXT_PUBLIC_WLD_APP_ID is undefined");
  return (
    <>
      <div>
        <IDKitWidget
          app_id={process.env.NEXT_PUBLIC_WLD_APP_ID} // obtained from the Developer Portal
          action="vote_1" // this is your action name from the Developer Portal
          onSuccess={onSuccess} // callback when the modal is closed
          handleVerify={handleVerify} // optional callback when the proof is received
          credential_types={[CredentialType.Orb, CredentialType.Phone]} // optional, defaults to ['orb']
          enableTelemetry // optional, defaults to false
        >
          {({ open }) => (
            <button
              className="cursor-pointer border-none px-5 py-2 rounded-md w-fit mx-auto bg-black hover:opacity-90 hover:bg-black transition"
              onClick={open}
            >
              Verify with World ID
            </button>
          )}
        </IDKitWidget>
        ;
      </div>
    </>
  );
}
