# Store Product Management Dashboard

Đây là ứng dụng dashboard quản lý sản phẩm cho cửa hàng, được xây dựng bằng [Next.js](https://nextjs.org) và [Supabase](https://supabase.com).

## Tính năng

- **Authentication**: Đăng nhập, Đăng ký (với Supabase Auth).
- **Quản lý sản phẩm**: Thêm, Sửa, Xóa, Xem chi tiết, Lịch sử bán hàng.
- **Quản lý đơn hàng**: Tạo đơn hàng mới, Xem danh sách đơn hàng, Chi tiết đơn hàng.
- **Hóa đơn**: Xuất/In hóa đơn cho đơn hàng.

## Hướng dẫn cài đặt và chạy dự án

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env.local` tại thư mục gốc của dự án và điền các thông tin từ Supabase của bạn:

```bash
cp .env.example .env.local
```

Nội dung file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Cấu hình Supabase (Quan trọng)

Để ứng dụng hoạt động, bạn cần thiết lập Database và Auth trên Supabase Dashboard.

#### Bước 3.1: Tạo bảng và Triggers (Schema)

1.  Truy cập vào **SQL Editor** trên dashboard dự án Supabase của bạn.
2.  Mở file `supabase_schema.sql` trong mã nguồn dự án này.
3.  Copy toàn bộ nội dung của `supabase_schema.sql` và paste vào SQL Editor của Supabase.
4.  Nhấn **Run** để tạo các bảng (`products`, `orders`, `order_items`, `users`), RLS policies và triggers.

#### Bước 3.2: Tạo dữ liệu mẫu (Seed Data)

1.  Vẫn trong **SQL Editor** (hoặc mở một query mới).
2.  Mở file `supabase_seed.sql` trong mã nguồn dự án này.
3.  Copy toàn bộ nội dung và paste vào SQL Editor.
4.  Nhấn **Run** để thêm dữ liệu mẫu (sản phẩm, đơn hàng).

#### Bước 3.3: Cấu hình Authentication

Để đơn giản hóa quá trình đăng ký/đăng nhập và tránh việc phải xác thực email trong môi trường dev:

1.  Truy cập vào **Authentication** -> **Providers** -> **Email** trên Supabase Dashboard.
2.  Tắt tùy chọn **Confirm email** (Confirm email addresses).
3.  Nhấn **Save**.

_Lưu ý: Nếu bạn không tắt tùy chọn này, user mới đăng ký sẽ không thể đăng nhập ngay mà phải click link trong email giả lập._

### 4. Chạy ứng dụng

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

### 5. Tạo tài khoản truy cập

- Truy cập vào trang Đăng ký (Sign up) trên giao diện web để tạo tài khoản mới.
- Sau khi đăng ký thành công, bạn có thể đăng nhập và truy cập vào Dashboard.

## Cấu trúc dự án

- `src/app`: Chứa source code chính (App Router).
- `src/components`: Các UI components (Shadcn UI).
- `src/lib`: Các hàm tiện ích và types.
- `src/utils/supabase`: Cấu hình Supabase Client/Server/Middleware.
- `supabase_schema.sql`: Script tạo cấu trúc database.
- `supabase_seed.sql`: Script tạo dữ liệu mẫu.
