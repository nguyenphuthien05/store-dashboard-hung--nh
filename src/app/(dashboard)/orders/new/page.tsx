import { createClient } from "@/utils/supabase/server";
import NewOrderClient from "./client";

export default async function NewOrderPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("name");

  return <NewOrderClient products={products || []} />;
}
