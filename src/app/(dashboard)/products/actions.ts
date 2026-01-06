"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock_quantity = parseInt(formData.get("stock_quantity") as string);
  const image_url = formData.get("image_url") as string;

  const { error } = await supabase.from("products").insert({
    name,
    description,
    price,
    stock_quantity,
    image_url,
  });

  if (error) {
    throw new Error("Failed to create product");
  }

  revalidatePath("/products");
  redirect("/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock_quantity = parseInt(formData.get("stock_quantity") as string);
  const image_url = formData.get("image_url") as string;

  const { error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
      stock_quantity,
      image_url,
    })
    .eq("id", id);

  if (error) {
    throw new Error("Failed to update product");
  }

  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  redirect("/products");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    throw new Error("Failed to delete product");
  }

  revalidatePath("/products");
}
