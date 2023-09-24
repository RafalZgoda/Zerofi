"use client";
import BorrowWidget from "@/components/borrow/borrow-widget";
import MyBorrows from "@/components/borrow/my-borrows";
import Pools from "@/components/lend/pools";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useContractWrite, useWalletClient } from "wagmi";
import { poolContractAddress, poolABI } from "@/lib/utils";
import { parseEther } from "ethers/lib/utils";
import { getContract } from "@wagmi/core";
import { getEthersSigner } from "@/lib/ethers";
import { Contract } from "ethers";
import ethers from "ethers";
export default function LoansPage() {
  // console.log({ contract });
  // const {
  //   data,
  //   isLoading,
  //   isSuccess,
  //   write: borrow,
  // } = useContractWrite({
  //   address: poolContractAddress as never,
  //   abi: poolABI as never,
  //   functionName: "borrow" as never,
  //   args: [args1, args2, args3] as never,
  // });
  const max = 5;

  //const { ready, authenticated } = usePrivy();
  const router = useRouter();

  // useEffect(() => {
  //   if (ready && !authenticated) {
  //     router.push("/");
  //   }
  // }, [ready, authenticated, router]);

  async function test() {
    try {
      const loanTerms = {
        borrower: "0x674dc72D0738D2f905aE9F3ef17C0384c8bd28d2", // Adresse Ethereum du demandeur de prêt
        amount: 1, // Montant du prêt en wei (1 ether dans cet exemple)
        interestRate: 1, // Taux d'intérêt en pourcentage multiplié par 10 (par exemple, 50.0% devient 500)
        duration: 1, // Durée du prêt en secondes (30 jours dans cet exemple)
      };
      const loanTermsT = [
        "0x674dc72D0738D2f905aE9F3ef17C0384c8bd28d2", 1, 1, 1
      ]

      const apiSignature = "0x"; // Remplacez par la signature API réelle
      const apiNonce = 123; // Remplacez par le nonce API réel
      console.log({
        loanTerms,
        apiSignature,
        apiNonce,
      });
      const options = { value: parseEther("0") };
      const signer = await getEthersSigner();
      const provider = signer.provider;
      console.log({ provider });
      const signerNew = provider.getSigner();
      console.log({ signerNew, signer });
      //const tx = contract.borrow(loanTerms, apiSignature, apiNonce, options);
      const contract = new Contract(poolContractAddress, poolABI, signerNew);
      console.log({ contract });
      const tx = await contract.borrow(
        loanTermsT, apiSignature, apiNonce
      );
      const txResponse = await signer.sendTransaction(tx)
      // const txData = txRequest.data;
      // console.log({ txData });

      // console.log({ tx });
      // const receipt = await tx.wait();

      // console.log({signer})
      // const transaction = {
      //   to: "0xc203f0aDA0eb8642bA50fA34E6c8c6dffc6233e2",
      //   data: '0x',
      // };

      // // Send the transaction and wait for it to be mined
      // const txResponse = await signer.sendTransaction(transaction);
      // console.log({ txResponse });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {/* {ready && authenticated && ( */}
      <div className="w-full flex justify-center items-center flex-col text-white gap-10 mt-10">
        <button
          onClick={() => test()}
          // disabled={!borrow}
          // onClick={() =>
          //   borrow({
          //     args: [69],
          //     from: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
          //     value: parseEther("0.01"),
          //   })
          // }
        >
          borrow test
        </button>
        <h1 className="text-5xl font-bold animate-pulse">
          You can borrow up to {max} ETH ✨
        </h1>
        <Tabs
          defaultValue="borrow"
          className=" w-7/12 flex flex-col justify-center gap-5"
        >
          <TabsList className="mx-auto bg-bg">
            <TabsTrigger value="borrow" className="w-32 ">
              Borrow
            </TabsTrigger>
            <TabsTrigger value="loan" className="w-32">
              Lend
            </TabsTrigger>
          </TabsList>
          <TabsContent value="borrow">
            <div className="m-auto h-96 bg-bg rounded-3xl flex items-center">
              <BorrowWidget max={max} />
              <MyBorrows />
            </div>
          </TabsContent>
          <TabsContent value="loan">
            <div className="m-auto bg-bg rounded-3xl flex flex-col items-center">
              <Pools />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* )} */}
    </>
  );
}
