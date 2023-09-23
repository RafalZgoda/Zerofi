import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function MyBorrows() {
  const borrows = [
    {
      amount: 3,
      duration: 7,
      interest: 25,
      daysLeft: 2,
      owed: 3.75,
    },
  ];

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
                    <h1 className="text-xl font-bold">{borrow.amount} ETH</h1>
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
                    You still owe {borrow.owed} ETH
                  </DialogTitle>
                  <DialogDescription className="flex justify-center pt-5">
                    <Button variant="outline" className="w-5/12 text-black">
                      Pay
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
