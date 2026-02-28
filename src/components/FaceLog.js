// components/FaceLog.js
"use client"; // Dòng này bắt buộc với Next.js mới để chạy Realtime
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Lấy key từ biến môi trường
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function FaceLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // 1. Lấy 10 người vào gần nhất khi mới tải trang
    const fetchLogs = async () => {
      let { data, error } = await supabase
        .from('face_logs') // Tên bảng trong SQL ông gửi tôi
        .select('*')
        .order('id', { ascending: false }) // Sắp xếp mới nhất lên đầu
        .limit(10);
        
      if (error) console.log("Lỗi lấy data:", error);
      if (data) setLogs(data);
    };

    fetchLogs();

    // 2. Lắng nghe dữ liệu MỚI (Realtime)
    console.log("Đang kết nối Realtime...");
    const channel = supabase
      .channel('realtime-face-logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'face_logs' },
        (payload) => {
          console.log('⚡ Có người mới:', payload.new);
          // Thêm người mới vào đầu danh sách ngay lập tức
          setLogs((currentLogs) => [payload.new, ...currentLogs]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
        📸 Camera Giám Sát (Live)
        <span className="ml-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
      </h2>
      
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left bg-white">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="p-3">Thời gian</th>
              <th className="p-3">Họ và Tên</th>
              <th className="p-3">Thiết bị</th>
              <th className="p-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-blue-50 transition-colors">
                <td className="p-3 text-gray-600">
                  {/* Chuyển giờ UTC sang giờ Việt Nam */}
                  {new Date(log.detected_at || log.created_at).toLocaleTimeString('vi-VN')}
                </td>
                <td className="p-3 font-bold text-blue-600 text-lg">
                  {log.student_name}
                </td>
                <td className="p-3 text-sm text-gray-500">{log.device_ip}</td>
                <td className="p-3">
                  <span className="px-3 py-1 text-xs font-bold text-green-800 bg-green-200 rounded-full">
                    {log.confidence || "High"}
                  </span>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">
                  Đang chờ dữ liệu từ Camera...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}