import { ethers } from "ethers";
import "dotenv/config";
import { socialABI, socialPool } from "../../../lib/utils";
import { getCreditLine } from "./getCreditLine";
import { getDataFromSupabase } from "../supabase";

const WEIGHT_APPROVE_CREDIT_LINE = 0.1;

const getContract = () => {
  const NEXT_WEB3_RPC = process.env.NEXT_WEB3_RPC;
  if (!NEXT_WEB3_RPC) throw new Error("NEXT_WEB3_RPC is not defined");

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_WEB3_RPC
  );
  const contract = new ethers.Contract(socialPool, socialABI, provider);
  return contract;
};

export const getLoansList = async (address: string): Promise<any> => {
  const contract = getContract();

  const relevantLoans: any = [];

  try {
    const nbOfLoansEmitted = await contract.nbOfLoansEmitted();
    console.log({ nbOfLoansEmitted });
    if (nbOfLoansEmitted.toNumber() === 0) return [];

    for (let i = 0; i < nbOfLoansEmitted; i++) {
      const loan = await contract.loan(i);
      if (loan.terms.borrower === address) {
        const status = await contract.loanStatus(i);
        relevantLoans.push({ loan, status });
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

// getLoansList("0x31304ccdd28e62ef552824db08a350d752068c39");

export const getLoanStatus = async (loanId) => {
  const contract = await getContract();
  const loan = await contract.loan(loanId);
  const status = await contract.loanStatus(loanId);
  console.log({ loan, status });
  return { loan, status };
};

// getLoanStatus(0);

const getLoansCreditLine = async (address: string): Promise<number> => {
  const loans = await getLoansList(address);
  if (loans.length === 0) return 0;

  const impactOnCreditLine = loans.reduce((acc, loan) => {
    console.log({ loan });
    if (loan.status === "DEFAULT") return acc + -loan.terms.amount; // on perd le montant du loan dans son credit score
    if (loan.status === "REPAID")
      return (
        acc +
        ((loan.terms.amount * loan.terms.interestRate) / 100) *
          loan.terms.duration
      ); // on gagne les interets dans son credit score
    return acc;
  }, 0);

  console.log({ impactOnCreditLine });
  const creditLine = loans.reduce((acc, loan) => {
    return acc + loan.terms.amount;
  }, 0);
  console.log({ creditLine });
  return creditLine;
};

// getLoansCreditLine("0x31304ccdd28e62ef552824db08a350d752068c39");

export const getCreditScoreWithHistoricalLoans = async (address: string) => {
  const creditLineBase = await getCreditLine(address);
  const creditLineLoans = await getLoansCreditLine(address);
  console.log({ creditLineBase, creditLineLoans });
  const creditScore = creditLineBase + creditLineLoans;
  console.log({ creditScore });
  return creditScore;
};

export const getAllApprovesOfUser = async (address: string) => {
  const approves = await getDataFromSupabase({
    supabaseTable: "approves",
    filter: {
      column: "beneficiary",
      operator: "eq",
      value: address,
    },
  });
  //   console.log({ approves });

  return approves;
};

const getBoostApproves = async (address: string) => {
  const approves = await getAllApprovesOfUser(address);
  //   console.log({ approves });

  const getAllCreditLinesFromEndorser = await Promise.all(
    approves.map((approve) => {
      return getCreditScoreWithHistoricalLoans(approve.endorser);
    })
  );

  console.log({ getAllCreditLinesFromEndorser });
  const creditLineApproves = getAllCreditLinesFromEndorser.reduce(
    (acc, creditLine) => {
      console.log({ creditLine });
      return acc + creditLine * WEIGHT_APPROVE_CREDIT_LINE;
    },
    0
  );

  console.log({ creditLineApproves });
  return creditLineApproves;
};

export const getCreditLineWithHistoryAndApproves = async (address: string) => {
  const creditLineBase = await getCreditLine(address);
  const creditLineLoans = await getLoansCreditLine(address);
  const creditLineApproves = await getBoostApproves(address);
  console.log({ creditLineBase, creditLineLoans, creditLineApproves });
  const creditLine = creditLineBase + creditLineLoans + creditLineApproves;
  console.log({ creditLine });
  return creditLine;
};

// getCreditLineWithHistoryAndApproves(
//   "0x674dc72d0738d2f905ae9f3ef17c0384c8bd28d2"
// );
