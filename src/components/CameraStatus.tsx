"use client"; // 👈 Bắt buộc có dòng này để nó tự đếm giờ được

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client"; // Lưu ý: dùng client
import { useEffect, useState } from "react";

export default function CameraStatus() {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState("Đang tải...");
  const supabase = createClient();

  const checkStatus = async () => {
    // Lấy log mới nhất
    const { data: lastLogs } = await supabase
      .from("face_logs")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1);

    if (lastLogs && lastLogs.length > 0) {
      const lastTime = new Date(lastLogs[0].created_at).getTime();
      const currentTime = new Date().getTime();
      const diffSeconds = (currentTime - lastTime) / 1000;

      // Nếu dữ liệu mới < 60 giây -> ONLINE
      if (diffSeconds < 60) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
      
      setLastSeen(new Date(lastLogs[0].created_at).toLocaleTimeString("vi-VN"));
    } else {
      setIsOnline(false);
      setLastSeen("Chưa có dữ liệu");
    }
  };

  useEffect(() => {
    checkStatus(); // Chạy ngay lập tức
    const interval = setInterval(checkStatus, 5000); // Lặp lại mỗi 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Camera Status</CardTitle>
        <div
          className={`h-4 w-4 rounded-full transition-all duration-500 ${
            isOnline
              ? "bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"
              : "bg-slate-400"
          }`}
        />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${isOnline ? "text-green-600" : "text-slate-500"}`}>
          {isOnline ? "Online" : "Offline"}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Cập nhật: {lastSeen}
        </p>
      </CardContent>
    </Card>
  );
}