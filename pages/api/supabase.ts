import { createClient, SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const DEFAULT_SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

export const createSupabaseClient = ({
  supabaseUrl,
  supabaseKey,
}: {
  supabaseUrl?: string;
  supabaseKey?: string;
}): SupabaseClient<any, "public", any> => {
  try {
    supabaseUrl = supabaseUrl || DEFAULT_SUPABASE_URL;
    supabaseKey = supabaseKey || DEFAULT_SUPABASE_KEY;

    const supabase = createClient(supabaseUrl, supabaseKey);
    return supabase;
  } catch (error) {
    console.error({ error });
    throw error;
  }
};

export const storeDataToSupabase = async ({
  supabaseUrl,
  supabaseKey,
  supabaseTable,
  data,
}: {
  supabaseUrl?: string;
  supabaseKey?: string;
  supabaseTable: string;
  data: any;
}): Promise<any> => {
  try {
    supabaseUrl = supabaseUrl || DEFAULT_SUPABASE_URL;
    supabaseKey = supabaseKey || DEFAULT_SUPABASE_KEY;
    const supabase = createSupabaseClient({ supabaseUrl, supabaseKey });
    const { data: response, error } = await supabase
      .from(supabaseTable)
      .insert(data);
    if (error) throw error;
    return response;
  } catch (error) {
    console.error({ error });
    throw error;
  }
};
