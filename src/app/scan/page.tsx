"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client"; 
import { ShoppingCart, ScanLine, PackageX, Loader2, WifiOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ScanPage() {
  const [scannedCode, setScannedCode] = useState<string>("");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [status, setStatus] = useState<string>("Đang kết nối..."); // Trạng thái Realtime

  // Dùng ref để giữ instance supabase không bị tạo lại
  const supabase = createClient();
  
  // Audio "Bíp"
  const beepSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Init âm thanh (nếu có file beep.mp3 trong thư mục public)
    // beepSound.current = new Audio("/beep.mp3");
    
    console.log("📡 Bắt đầu lắng nghe...");

    const channel = supabase
      .channel("scan-page-listener")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "temp_scans" },
        (payload) => {
          const newCode = payload.new.barcode;
          console.log("🔫 NHẬN TÍN HIỆU:", newCode);
          
          // Play sound
          // if (beepSound.current) beepSound.current.play().catch(() => {});

          setScannedCode(newCode);
          handleFindProduct(newCode);
        }
      )
      .subscribe((status) => {
        // Log trạng thái kết nối để debug
        console.log("🔌 Trạng thái kết nối:", status);
        if (status === "SUBSCRIBED") setStatus("Sẵn sàng quét");
        if (status === "CHANNEL_ERROR") setStatus("Lỗi kết nối Realtime");
        if (status === "TIMED_OUT") setStatus("Mạng yếu...");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleFindProduct = async (code: string) => {
    setLoading(true);
    setNotFound(false);
    setProduct(null);

    // Tìm trong bảng products
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("barcode", code)
      .single();

    if (error || !data) {
      console.log("❌ Không tìm thấy sản phẩm");
      setNotFound(true);
    } else {
      console.log("✅ Tìm thấy:", data.name);
      setProduct(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      
      {/* HEADER */}
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-3">
          Máy Check Giá <ShoppingCart className="text-blue-600" />
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm font-mono">
            Trạng thái: 
            <span className={`px-2 py-0.5 rounded ${status === 'Sẵn sàng quét' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {status}
            </span>
        </div>
      </div>

      {/* KHUNG HIỂN THỊ KẾT QUẢ */}
      <div className="w-full max-w-md">
        
        {/* TRẠNG THÁI CHỜ */}
        {!product && !loading && !notFound && (
          <Card className="border-dashed border-2 text-center py-12 bg-white/50">
            <div className="flex flex-col items-center gap-4 text-slate-400">
              <ScanLine size={64} className="animate-pulse" />
              <p className="text-lg">Đang chờ quét mã...</p>
              {scannedCode && <p className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">Mã cũ: {scannedCode}</p>}
            </div>
          </Card>
        )}

        {/* TRẠNG THÁI ĐANG TÌM */}
        {loading && (
          <Card className="py-12 text-center border-blue-200 bg-blue-50">
            <div className="flex flex-col items-center gap-4 text-blue-600">
               <Loader2 className="animate-spin w-12 h-12" />
               <p className="font-medium">Đang tra cứu dữ liệu...</p>
            </div>
          </Card>
        )}

        {/* KẾT QUẢ: TÌM THẤY SẢN PHẨM */}
        {product && (
          <Card className="overflow-hidden border-2 border-green-500 shadow-xl animate-in fade-in zoom-in duration-300">
            <div className="aspect-video relative bg-white flex items-center justify-center p-4 border-b">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="object-contain max-h-48 w-full"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-300">
                    <ScanLine size={40} />
                    <span className="text-xs mt-2">No Image</span>
                </div>
              )}
            </div>
            
            <CardHeader className="bg-green-50">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-xs text-slate-500 font-mono bg-white px-2 py-0.5 rounded border inline-block mb-1">
                        #{product.barcode}
                   </p>
                   <CardTitle className="text-2xl text-slate-800">{product.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-slate-500">Đơn giá:</span>
                    <span className="text-4xl font-black text-blue-600">${product.price}</span>
                </div>
                
                <div className="h-px bg-slate-100 my-2"></div>

                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tồn kho:</span>
                    <span className={`font-bold px-2 py-0.5 rounded ${product.stock_quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock_quantity} cái
                    </span>
                </div>
            </CardContent>
          </Card>
        )}

        {/* KẾT QUẢ: KHÔNG TÌM THẤY */}
        {notFound && (
          <Card className="border-2 border-red-200 bg-red-50 text-center py-8 shadow-lg">
            <div className="flex flex-col items-center gap-2 text-red-600">
              <PackageX size={60} />
              <h3 className="text-2xl font-bold mt-2">Không tìm thấy!</h3>
              <div className="bg-white px-4 py-2 rounded border border-red-100 shadow-sm mt-2">
                 <p className="text-slate-500 text-xs uppercase tracking-wide">Mã vạch</p>
                 <p className="text-3xl font-mono font-black text-slate-800">{scannedCode}</p>
              </div>
              <p className="text-sm mt-4 text-red-500">Sản phẩm chưa được nhập vào hệ thống.</p>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}