import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, ScanBarcode } from "lucide-react"; // Đã thêm ScanBarcode vào đây

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function DashboardNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
      >
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Overview
      </Link>
      <Link
        href="/products"
        className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
      >
        <Package className="mr-2 h-4 w-4" />
        Products
      </Link>
      <Link
        href="/orders"
        className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        Orders
      </Link>

      {/* 👇 NÚT MỚI THÊM VÀO ĐÂY 👇 */}
      <Link
        href="/scan"
        className={cn(buttonVariants({ variant: "ghost" }), "justify-start font-bold text-blue-600")}
      >
        <ScanBarcode className="mr-2 h-4 w-4" />
        Bán Hàng
      </Link>
      
    </nav>
  );
}