"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ==========================================
// 1. HÀM TẠO SẢN PHẨM MỚI (CREATE)
// ==========================================
export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  // Lấy dữ liệu từ form
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock_quantity = parseInt(formData.get("stock_quantity") as string);
  const image_url = formData.get("image_url") as string;
  
  // --- LOGIC TỰ SINH BARCODE ---
  let barcode = formData.get("barcode") as string;

  // Nếu người dùng không nhập hoặc nhập toàn khoảng trắng
  if (!barcode || barcode.trim() === "") {
    // Tự sinh mã dựa trên thời gian (đảm bảo không trùng)
    barcode = Date.now().toString(); 
  }
  // -----------------------------

  const { error } = await supabase.from("products").insert({
    name,
    description,
    price,
    stock_quantity,
    image_url,
    barcode, // Đã có giá trị (nhập tay hoặc tự sinh)
  });

  if (error) {
    console.error("Lỗi tạo SP:", error);
    throw new Error("Failed to create product");
  }

  // Làm mới dữ liệu trang danh sách
  revalidatePath("/products");
  redirect("/products");
}

// ==========================================
// 2. HÀM CẬP NHẬT SẢN PHẨM (UPDATE)
// ==========================================
export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock_quantity = parseInt(formData.get("stock_quantity") as string);
  const image_url = formData.get("image_url") as string;

  // --- LOGIC TỰ SINH BARCODE (DỰ PHÒNG) ---
  // Phòng trường hợp lúc sửa, người dùng lỡ tay xóa mất mã vạch cũ
  let barcode = formData.get("barcode") as string;

  if (!barcode || barcode.trim() === "") {
    barcode = Date.now().toString();
  }
  // ----------------------------------------

  const { error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
      stock_quantity,
      image_url,
      barcode,
    })
    .eq("id", id);

  if (error) {
    console.error("Lỗi update SP:", error);
    throw new Error("Failed to update product");
  }

  revalidatePath("/products");
  redirect("/products");
}

// ==========================================
// 3. HÀM XÓA SẢN PHẨM (DELETE)
// ==========================================
export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Lỗi xóa SP:", error);
    throw new Error("Failed to delete product");
  }

  revalidatePath("/products");
}