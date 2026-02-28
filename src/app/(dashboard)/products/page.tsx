import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/server";
import { DeleteProductButton } from "./delete-button";

// 👇 1. THÊM DÒNG NÀY: Bắt buộc tải dữ liệu mới nhất (chống lưu cache)
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const supabase = await createClient();
  
  // 👇 2. SỬA ĐOẠN NÀY: Sắp xếp theo 'id' thay vì 'created_at' để tránh lỗi nếu thiếu cột
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  // 👇 3. THÊM ĐOẠN NÀY: Nếu lỗi thì báo ra màn hình thay vì sập web
  if (error) {
    console.error("Lỗi Supabase:", error);
    return (
      <div className="p-8 text-red-500">
        Lỗi tải dữ liệu: {error.message} <br/>
        (Hãy kiểm tra lại Console hoặc Database)
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          <Link href="/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
          </Link>
        </div>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded object-cover aspect-square border"
                    />
                  ) : (
                     // Hiển thị khung xám nếu không có ảnh
                    <div className="w-[50px] h-[50px] bg-slate-100 rounded border flex items-center justify-center text-[10px] text-slate-400">
                        No IMG
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                
                <TableCell>
                  <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded border">
                    {product.barcode || "---"}
                  </span>
                </TableCell>

                <TableCell>${product.price}</TableCell>
                
                <TableCell>
                    {/* Tô màu nếu sắp hết hàng */}
                    <span className={`px-2 py-1 rounded text-xs ${product.stock_quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock_quantity}
                    </span>
                </TableCell>
                
                <TableCell className="text-right space-x-2 flex justify-end">
                  <Link href={`/products/${product.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <DeleteProductButton id={product.id} />
                </TableCell>
              </TableRow>
            ))}
            
            {/* Hiển thị khi danh sách trống */}
            {(!products || products.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}