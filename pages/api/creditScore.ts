import type { NextApiRequest, NextApiResponse } from "next";
import { getCreditLine } from "./server/getCreditLine";
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
  const formatted = Math.floor(creditLine);
  console.log({ creditLine, formatted });

  res.status(200).json({ message: formatted.toString() });
}
