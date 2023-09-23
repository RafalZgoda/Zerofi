import BorrowWidget from "@/components/borrow/borrow-widget";
import MyBorrows from "@/components/borrow/my-borrows";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoansPage() {
  const max = 5;

  return (
    <div className="w-full flex justify-center items-center flex-col text-white gap-10 mt-10">
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
        <TabsContent value="loan">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
