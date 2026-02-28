import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { ShoppingCart, DollarSign, Users } from "lucide-react";
import FaceLog from "@/components/FaceLog";
import CameraStatus from "@/components/CameraStatus"; // 👈 Đã thêm cái này vào

// Bắt buộc làm mới dữ liệu mỗi khi tải trang
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  // --- 1. Lấy dữ liệu thống kê (Tiền nong, Sản phẩm) ---
  const { data: products } = await supabase.from("products").select("id");
  const { data: orders } = await supabase.from("orders").select("id,total_amount");
  const totalRevenue = orders?.reduce((acc, order) => acc + order.total_amount, 0) || 0;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Thẻ Doanh Thu */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        {/* Thẻ Số Đơn Hàng */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.length || 0}</div>
          </CardContent>
        </Card>

        {/* Thẻ Số Sản Phẩm */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || 0}</div>
          </CardContent>
        </Card>

        {/* 👇 THẺ CAMERA STATUS (Tự động cập nhật Realtime) 👇 */}
        <CameraStatus />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Cột Trái: Danh sách Camera Log */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>📸 Giám Sát Ra Vào (Realtime)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <FaceLog />
          </CardContent>
        </Card>

        {/* Cột Phải: Danh sách đơn hàng gần đây */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Olivia Martin</p>
                  <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}