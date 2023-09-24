import { ethers } from "ethers";
import "dotenv/config";
import { socialABI, socialPool } from "../../../lib/utils";

const NEXT_WEB3_RPC = process.env.NEXT_WEB3_RPC;
if (!NEXT_WEB3_RPC) throw new Error("NEXT_WEB3_RPC is not defined");

export const getLoansList = async (address: string): Promise<any> => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_WEB3_RPC
  );

  const contract = new ethers.Contract(socialPool, socialABI, provider);
  const relevantLoans: any = [];

  try {
    const nbOfLoansEmitted = await contract.nbOfLoansEmitted();
    console.log({ nbOfLoansEmitted });
    if (nbOfLoansEmitted.toNumber() === 0) return [];

    for (let i = 0; i < nbOfLoansEmitted; i++) {
      const loan = await contract.loan(i);
      if (loan.terms.borrower === address) {
        relevantLoans.push(loan);
      }
    }

    return relevantLoans;
  } catch (error) {
    console.error("Error:", error);
    if (error.data) {
      console.error(
        "Error data:",
        ethers.utils.toUtf8String("0x" + error.data.slice(10))
      );
    }
    return [];
  }
};

getLoansList("0x31304ccdd28e62ef552824db08a350d752068c39");
