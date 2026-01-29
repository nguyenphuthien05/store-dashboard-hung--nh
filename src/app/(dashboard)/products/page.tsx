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

export default async function ProductsPage() {
  const supabase = await createClient();
  
  // Lấy dữ liệu (đã bao gồm barcode vì select *)
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

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
              
              {/* 👇 1. THÊM TIÊU ĐỀ CỘT BARCODE Ở ĐÂY */}
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
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded object-cover aspect-square"
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                
                {/* 👇 2. THÊM DỮ LIỆU BARCODE Ở ĐÂY */}
                <TableCell>
                  <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded border">
                    {product.barcode || "---"}
                  </span>
                </TableCell>

                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stock_quantity}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/products/${product.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <DeleteProductButton id={product.id} />
                </TableCell>
              </TableRow>
            ))}{!products?.length && (
              <TableRow>
                {/* 👇 Sửa colSpan thành 6 cho đủ cột */}
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