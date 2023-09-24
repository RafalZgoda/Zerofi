"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { poolABI, poolContractAddress } from "@/lib/utils";

export default function BorrowWidget({ max }: { max: number }) {
  const [duration, setDuration] = useState<string | undefined>();
  const [amount, setAmount] = useState<string | undefined>("0");
  const { config, error } = usePrepareContractWrite({
    address: poolContractAddress as never,
    abi: poolABI as never,
    functionName: 'borrow' as never,
    args: [['0x01897AE155C69495Aa3976CF5987D0D143755eE5', BigInt(1), BigInt(1), BigInt(1)], "0x00", BigInt(1)] as never,
  })

  const borrow = async () => {};

  return (
    <div className="w-[50%] rounded-3xl z-20 h-[105%] gap-3 bg-[#100c17] flex flex-col py-8 px-16 drop-shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-5">Borrow ETH</h1>
      <div className="bg-white/5 rounded-xl px-3 py-5">
        <h1 className="text-sm text-gray-300 pl-3">Borrow Amount</h1>
        <Input
          placeholder={`0`}
          className="border-none text-3xl"
          onChange={(e) => setAmount(e.target.value)}
        />
        <p className="text-xs text-right text-gray-600 pr-3">Max {max} ETH</p>
      </div>
      <Select value={duration} onValueChange={(value) => setDuration(value)}>
        <SelectTrigger className="w-full mt-3">
          <SelectValue placeholder="Duration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 Day</SelectItem>
          <SelectItem value="7">7 Days</SelectItem>
          <SelectItem value="30">30 Days</SelectItem>
        </SelectContent>
      </Select>
      <Button
        className="mt-3 cursor-pointer bg-white text-black disabled:opacity-50"
        disabled={amount == "0" || duration == "0" || !duration || !amount}
        onClick={borrow}
      >
        Borrow
      </Button>
    </div>
  );
}
