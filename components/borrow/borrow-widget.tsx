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

export default function BorrowWidget({ max }: { max: number }) {
  const [duration, setDuration] = useState<string | undefined>();
  const [amount, setAmount] = useState<string | undefined>("0");

  return (
    <div className="w-[50%] rounded-3xl z-20 h-[105%] gap-3 bg-bg flex flex-col py-8 px-16 drop-shadow-lg">
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
      >
        Borrow
      </Button>
    </div>
  );
}
