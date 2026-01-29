import Link from "next/link";
import { updateProduct } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ProductEditForm from "@/components/product-edit-form"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Sale {
  id: string;
  quantity: number;
  price_at_time: number;
  orders: {
    created_at: string;
    customer_name: string;
    id: string;
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch sales history
  const { data: rawSales } = await supabase
    .from("order_items")
    .select("*, orders(created_at, customer_name, id)")
    .eq("product_id", id)
    .order("created_at", { foreignTable: "orders", ascending: false });

  const sales = rawSales as unknown as Sale[];

  const updateProductWithId = updateProduct.bind(null, id);

  return (
     <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Product Details</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Edit Product</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 👇 THAY TOÀN BỘ CODE FORM CŨ BẰNG ĐÚNG 1 DÒNG NÀY 👇 */}
            <ProductEditForm product={product} updateAction={updateProductWithId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales History</CardTitle>
          </CardHeader>
          {/* ... Phần bảng Sales History giữ nguyên ... */}
        </Card>
      </div>
    </div>
  );
}
