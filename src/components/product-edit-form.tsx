  "use client";

  import { useState, useEffect } from "react";
  import { io } from "socket.io-client";
  import { toast } from "sonner";
  import Link from "next/link";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Textarea } from "@/components/ui/textarea";

  export default function ProductEditForm({ product, updateAction }: { product: any, updateAction: any }) {
    
    // 1. LOGIC SOCKET (Để nghe Hercules)
    const [barcode, setBarcode] = useState(product.barcode || "");

    useEffect(() => {
      // Kết nối socket
      const socket = io("http://localhost:3001"); 

      socket.on("web-receive-barcode", (code) => {
        setBarcode(code);
        toast.success(`Đã nhận mã: ${code}`);
      });

      return () => { socket.disconnect(); };
    }, []);

    // 2. GIAO DIỆN FORM (Bao gồm cả Cũ và Mới)
    return (
      <form action={updateAction} className="space-y-4">
        
        {/* --- ĐÂY LÀ Ô MỚI (MÃ VẠCH) --- */}
        <div className="grid gap-2">
          <Label htmlFor="barcode">Barcode (Mã vạch)</Label>
          <div className="flex gap-2">
              <Input 
                id="barcode" 
                name="barcode" 
                value={barcode} 
                onChange={(e) => setBarcode(e.target.value)} 
                placeholder="Quét mã từ điện thoại..." 
                className="bg-blue-50 border-blue-200" // Màu xanh nhạt cho dễ nhìn
              />
          </div>
          <p className="text-[0.8rem] text-muted-foreground">
            Dùng Hercules quét mã để tự điền vào đây.
          </p>
        </div>

        {/* --- ĐÂY LÀ CÁC Ô CŨ (TÔI ĐÃ CHÉP LẠI Y NGUYÊN CHO ÔNG) --- */}
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