import type { NextApiRequest, NextApiResponse } from "next";
import { deleteRowsFromSupabase } from "./supabase";
type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  let { endorser, beneficiary } = req.body as {
    endorser: string;
    beneficiary: string;
  };
  endorser = endorser?.toLowerCase();
  beneficiary = beneficiary?.toLowerCase();
  console.log({ endorser, beneficiary, req: req.body });
  // console.log({ req });
  const store = await deleteRowsFromSupabase({
    supabaseTable: "approves",
    filter1: {
      column: "endorser",
      operator: "eq",
      value: endorser,
    },
    filter2: {
      column: "beneficiary",
      operator: "eq",
      value: beneficiary,
    },
  });
  console.log({ store });

  res.status(200).json({ message: store });
}
