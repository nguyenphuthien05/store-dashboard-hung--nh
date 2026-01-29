"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ---------------------------------------------------------
// 1. HÀM TẠO SẢN PHẨM MỚI (Thêm barcode vào đây luôn cho đồng bộ)
// ---------------------------------------------------------
export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock_quantity = parseInt(formData.get("stock_quantity") as string);
  const image_url = formData.get("image_url") as string;
  
  // 👇 THÊM DÒNG NÀY
  const barcode = formData.get("barcode") as string; 

  const { error } = await supabase.from("products").insert({
    name,
    description,
    price,
    stock_quantity,
    image_url,
    barcode, // 👈 LƯU BARCODE VÀO DB
  });

  if (error) {
    console.error("Lỗi tạo SP:", error);
    throw new Error("Failed to create product");
  }

  revalidatePath("/products");
  redirect("/products");
}

// ---------------------------------------------------------
// 2. HÀM CẬP NHẬT SẢN PHẨM (Cái ông đang cần nhất)
// ---------------------------------------------------------
export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock_quantity = parseInt(formData.get("stock_quantity") as string);
  const image_url = formData.get("image_url") as string;

  // 👇 THÊM DÒNG NÀY
  const barcode = formData.get("barcode") as string;

  const { error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
      stock_quantity,
      image_url,
      barcode, // 👈 CẬP NHẬT BARCODE VÀO DB
    })
    .eq("id", id);

  if (error) {
    console.error("Lỗi update SP:", error);
    throw new Error("Failed to update product");
  }

  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  redirect("/products");
}

// ---------------------------------------------------------
// 3. HÀM XÓA SẢN PHẨM (Giữ nguyên)
// ---------------------------------------------------------
export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    throw new Error("Failed to delete product");
  }

  revalidatePath("/products");
}