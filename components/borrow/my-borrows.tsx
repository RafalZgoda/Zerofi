import { RocketIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { useAccount } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { socialABI, socialPool } from "@/lib/utils";
import { getEthersSigner } from "@/lib/signer";
import { Contract } from "ethers";
export default function MyBorrows() {
  const { address } = useAccount();
  const borrows = [
    {
      amount: 3,
      duration: 7,
      interest: 25,
      daysLeft: 2,
      owed: 3.75,
      loanId: 0,
    },
  ];

  async function repay(loanId: number) {
    const signer = await getEthersSigner();
    if (!signer || !address) return;
    const contract = new Contract(socialPool, socialABI, signer);
    const loadnId = 0;
    const tx = await contract.repay(loadnId);
    console.log({ tx });
    const txResponse = await signer.sendTransaction(tx);
    console.log({ txResponse });
    //TODO: post on lens 
  }

  return (
    <div className="w-[50%] rounded-r-3xl z-10 flex flex-col justify-start h-full py-10 px-14">
      {borrows.length > 0 && (
        <div className="">
          <p className="text-center mb-3 text-sm">My active loans</p>
          {borrows.map((borrow, index) => (
            <Dialog key={index}>
              <DialogTrigger className="w-full mb-3">
                <div className="cursor-pointer glass p-3 px-5 flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold">{borrow.amount} USDC</h1>
                    <p className="text-xs text-left text-white/80">
                      {borrow.duration} Days
                    </p>
                  </div>
                  <div className="text-right">
                    <h1 className="text-3xl font-bold">{borrow.interest}%</h1>
                    <p>{borrow.daysLeft} days left</p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Pay back your loan
                  </DialogTitle>
                  <DialogDescription className="flex justify-center flex-col">
                    <Alert className="border-none">
                      <RocketIcon className="h-4 w-4" />
                      <AlertTitle>Heads up!</AlertTitle>
                      <AlertDescription>
                        You have {borrow.daysLeft} days left to pay back your
                        loan.
                      </AlertDescription>
                    </Alert>
                    <Button
                      variant="outline"
                      className="mx-auto w-5/12 text-black"
                      onClick={() => repay(borrow.loanId)}
                    >
                      Pay {borrow.owed} USDC
                    </Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
      {borrows.length === 0 && (
        <p className="m-auto text-xs">No current borrowing</p>
      )}
    </div>
  );
}
