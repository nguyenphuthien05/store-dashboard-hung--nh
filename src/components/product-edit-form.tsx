"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"; // Dùng Supabase thay vì Socket.io
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScanLine } from "lucide-react"; // Icon cho đẹp

export default function ProductEditForm({ product, updateAction }: { product: any, updateAction: any }) {
  
  // 1. LOGIC SUPABASE REALTIME (Thay thế Socket.io)
  const [barcode, setBarcode] = useState(product.barcode || "");
  const supabase = createClient();

  useEffect(() => {
    console.log("📡 Form đang lắng nghe mã vạch...");

    const channel = supabase
      .channel("product-edit-listener")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "temp_scans" },
        (payload) => {
          const newCode = payload.new.barcode;
          console.log("🔫 Đã nhận mã:", newCode);
          
          setBarcode(newCode);
          toast.success(`Đã cập nhật mã: ${newCode}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 2. GIAO DIỆN FORM
  return (
    <form action={updateAction} className="space-y-4">
      
      {/* --- Ô NHẬP MÃ VẠCH (TỰ ĐỘNG) --- */}
      <div className="grid gap-2">
        <Label htmlFor="barcode" className="flex items-center gap-2">
            Barcode (Mã vạch) <ScanLine className="w-4 h-4 text-blue-500" />
        </Label>
        <div className="flex gap-2">
            <Input 
              id="barcode" 
              name="barcode" 
              value={barcode} 
              onChange={(e) => setBarcode(e.target.value)} 
              placeholder="Đang chờ quét mã..." 
              className="bg-blue-50 border-blue-200 text-blue-800 font-mono font-bold" 
            />
        </div>
        <p className="text-[0.8rem] text-muted-foreground">
          Mẹo: Dùng máy quét tít một cái, mã sẽ tự nhảy vào đây.
        </p>
      </div>

      {/* --- CÁC Ô CŨ GIỮ NGUYÊN --- */}
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={product.name} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={product.description || ""} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stock_quantity">Stock Quantity</Label>
          <Input id="stock_quantity" name="stock_quantity" type="number" defaultValue={product.stock_quantity} required />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input id="image_url" name="image_url" defaultValue={product.image_url || ""} placeholder="https://example.com/image.jpg" />
      </div>

      <div className="flex justify-end space-x-2">
        <Link href="/products">
        <Button variant="outline">Cancel</Button>
        </Link>
        <Button type="submit">Update Product</Button>
      </div>
    </form>
  );
}