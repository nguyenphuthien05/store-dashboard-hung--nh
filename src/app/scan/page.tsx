"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; 
import { ShoppingCart, ScanLine, PackageX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // Thêm toast cho đẹp nếu muốn

export default function ScanPage() {
  const [scannedCode, setScannedCode] = useState<string>("");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const supabase = createClient();

  // --- PHẦN SỬA ĐỔI: DÙNG SUPABASE REALTIME THAY VÌ SOCKET.IO ---
  useEffect(() => {
    console.log("📡 Đang lắng nghe Database...");

    // Đăng ký kênh lắng nghe bảng 'temp_scans'
    const channel = supabase
      .channel("scan-page-listener")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "temp_scans" },
        (payload) => {
          const newCode = payload.new.barcode;
          console.log("⚡ Database có mã mới:", newCode);
          
          // Cập nhật giao diện
          setScannedCode(newCode);
          
          // Tự động tìm sản phẩm luôn
          handleFindProduct(newCode);
        }
      )
      .subscribe();

    // Dọn dẹp khi rời trang
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]); 
  // -----------------------------------------------------------

  const handleFindProduct = async (code: string) => {
    setLoading(true);
    setNotFound(false);
    setProduct(null);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("barcode", code)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setProduct(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      
      {/* HEADER */}
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Máy Check Giá 🛒
        </h1>
        <p className="text-slate-500">Quét mã vạch để xem thông tin sản phẩm</p>
      </div>

      {/* KHUNG HIỂN THỊ KẾT QUẢ */}
      <div className="w-full max-w-md">
        
        {/* TRẠNG THÁI CHỜ */}
        {!product && !loading && !notFound && (
          <Card className="border-dashed border-2 text-center py-12">
            <div className="flex flex-col items-center gap-4 text-slate-400">
              <ScanLine size={64} />
              <p className="text-lg">Đang chờ quét mã...</p>
              {scannedCode && <p className="text-sm">Mã vừa nhận: {scannedCode}</p>}
            </div>
          </Card>
        )}

        {/* TRẠNG THÁI ĐANG TÌM */}
        {loading && (
          <Card className="py-12 text-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
               <div className="h-16 w-16 bg-slate-200 rounded-full"></div>
               <div className="h-4 w-48 bg-slate-200 rounded"></div>
               <p>Đang tra cứu dữ liệu...</p>
            </div>
          </Card>
        )}

        {/* KẾT QUẢ: TÌM THẤY SẢN PHẨM */}
        {product && (
          <Card className="overflow-hidden border-2 border-green-500 shadow-xl">
            <div className="aspect-video relative bg-white flex items-center justify-center p-4">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="object-contain max-h-48 w-full"
                />
              ) : (
                <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-300">
                    No Image
                </div>
              )}
            </div>
            
            <CardHeader className="bg-green-50 border-t">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-sm text-slate-500 font-mono">#{product.barcode}</p>
                   <CardTitle className="text-2xl mt-1">{product.name}</CardTitle>
                </div>
                <div className="text-right">
                   <p className="text-xs text-slate-500">Giá bán</p>
                   <p className="text-3xl font-bold text-green-700">
                     ${product.price}
                   </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tồn kho:</span>
                    <span className="font-medium">{product.stock_quantity} cái</span>
                </div>
                <div className="bg-slate-100 p-3 rounded text-sm text-slate-600">
                    {product.description || "Chưa có mô tả cho sản phẩm này."}
                </div>
            </CardContent>
          </Card>
        )}

        {/* KẾT QUẢ: KHÔNG TÌM THẤY */}
        {notFound && (
          <Card className="border-2 border-red-200 bg-red-50 text-center py-8">
            <div className="flex flex-col items-center gap-2 text-red-600">
              <PackageX size={48} />
              <h3 className="text-xl font-bold">Không tìm thấy sản phẩm!</h3>
              <p className="text-slate-600">Mã vạch: <span className="font-mono font-bold">{scannedCode}</span></p>
              <p className="text-sm mt-2">Vui lòng kiểm tra lại hoặc thêm sản phẩm mới.</p>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}