import type { NextApiRequest, NextApiResponse } from "next";
import { getCreditLine } from "./server/getCreditLine";
import { getCreditLineWithHistoryAndApproves } from "./server/getLoansList";
type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const addressCap = req.query.address as string;
  const address = addressCap.toLowerCase();
  // console.log({ req });
  const creditLine = await getCreditLine(address);
  const creditLine2 = await getCreditLineWithHistoryAndApproves(address);

  const formatted = Math.floor(creditLine2);
  console.log({ creditLine, formatted, creditLine2 });

  res.status(200).json({ message: formatted.toString() });
}
