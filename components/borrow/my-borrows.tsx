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
import { getChainInfo, socialABI, socialPool } from "@/lib/utils";
import { getEthersSigner } from "@/lib/signer";
import { Contract } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
export default function MyBorrows() {
  const { address } = useAccount();
  const [loans, setLoans] = useState<any[]>([]);
  // 0 ongoin, 1 repaid, 2 defaulted
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
    const chainId = signer.provider._network.chainId;
    const currentChainInfos = getChainInfo(chainId);
    console.log({ signer, chainId, currentChainInfos });

    const contract = new Contract(currentChainInfos.pool, socialABI, signer);
    const loadnId = 0;
    const tx = await contract.repay(loadnId);
    console.log({ tx });
    const txResponse = await signer.sendTransaction(tx);
    console.log({ txResponse });
    //TODO: post on lens
  }
  const getBorrows = async () => {
    const l = await axios.post("/api/loans", {
      address: address,
    });
    setLoans(l.data.message);
    console.log({ loans: l.data.message });
  };

  useEffect(() => {
    getBorrows();
  }, []);

  // {
  //   loan: {
  //     terms: {
  //       borrower: loan.terms.borrower,
  //       amount: loan.terms.amount.toString(),
  //       duration: loan.terms.limitRepayDate.toString(),
  //       interestRate: 0.2,
  //     },
  //   },
  //   status,
  // }

  return (
    <div className="w-[50%] rounded-r-3xl z-10 flex flex-col justify-start h-full py-10 px-14">
      {loans.length > 0 && (
        <div className="overflow-y-auto">
          <p className="text-center mb-3 text-sm">My active loans</p>

          {loans
            .filter((loan) => loan.status === 0)
            .map((loan, index) => (
              <Dialog key={index}>
                <DialogTrigger className="w-full mb-3">
                  <div className="cursor-pointer glass p-3 px-5 flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-bold">
                        {parseFloat(loan.terms.amount) / 10 ** 18} USDC
                      </h1>
                      <p className="text-xs text-left text-white/80">7 Days</p>
                    </div>
                    <div className="text-right">
                      <h1 className="text-3xl font-bold">
                        {parseFloat(loan.terms.interestRate) * 100}%
                      </h1>
                      <p className="text-xs">7 days left</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h1 className="text-3xl font-bold">{loan.interest}%</h1>
                    <p>{loan.daysLeft} days left</p>
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
                          You have {loan.daysLeft} days left to pay back your
                          loan.
                        </AlertDescription>
                      </Alert>
                      <Button
                        variant="outline"
                        className="mx-auto w-5/12 text-black"
                        onClick={() => repay(loan.loanId)}
                      >
                        Pay {loan.owed} USDC
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
