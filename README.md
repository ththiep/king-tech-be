# King Tech Backend 🚀

King Tech Backend là hệ thống RESTful API cấp doanh nghiệp, được xây dựng theo mô hình **SaaS Đa Doanh Nghiệp (Multi-Tenant)**. Nền tảng này đóng vai trò lõi xử lý dữ liệu cho các phân hệ: Quản trị Nhân sự (HRM), Quản lý Chấm công (Attendance), và cấu hình hệ thống. Phân hệ đơn hàng/tồn kho hiện được đánh dấu **inactive** ở runtime cho tới khi quay lại phát triển.

## ✨ Tính Năng Nổi Bật (Key Features)
- **Multi-Tenancy & Data Isolation:** Mỗi doanh nghiệp (Tenant) sở hữu một không gian dữ liệu độc lập. Dữ liệu được bảo vệ tuyệt đối và cô lập thông qua JWT Token và các lớp truy vấn cấp thấp.
- **Clean Architecture + SOLID:** Tuân thủ kiến trúc 3 lớp (Controller -> Service -> Repository) giúp dễ dàng bảo trì và mở rộng.
- **Dependency Injection (DI):** Sử dụng `Awilix` để quản lý phụ thuộc tập trung; service được resolve theo request scope, repository giữ stateless singleton.
- **Security & Protection:** 
  - Mã hóa mật khẩu an toàn.
  - Tích hợp `Rate Limiter` chống tấn công DDoS/Brute-force.
  - Bảo mật dữ liệu tải lên với Multer.
- **Data Transfer Objects (DTO):** Mọi request (dữ liệu vào) và response (dữ liệu ra) đều bị buộc phải đi qua các Model DTO, đảm bảo an toàn tuyệt đối và loại bỏ hoàn toàn việc lọt dữ liệu nhạy cảm ra ngoài.
- **Centralized Logging:** Tích hợp Winston và Morgan ghi log HTTP và log hệ thống tự động, hỗ trợ luân chuyển file log (Daily Rotate).
- **Audit Logs:** Tự động lưu vết lịch sử mọi thao tác thay đổi dữ liệu của Admin.
- **Nhập/Xuất Excel (Batch Operations):** Hỗ trợ thao tác số lượng lớn với validation Zod cho dữ liệu import Excel/CSV.

## 🛠 Tech Stack
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js (`express` v5.x)
- **Database / BaaS:** Supabase (PostgreSQL) qua `@supabase/supabase-js`
- **Dependency Injection:** `awilix` (Quản lý IoC Container cấp Request-Scoped)
- **Data Validation & Request Models:** `zod`
- **Response Models (DTO):** Vanilla ES6 Classes (Thuần JavaScript)
- **Authentication:** `jsonwebtoken` (JWT) + `bcryptjs`
- **File Upload:** `multer`
- **Logging:** `winston` (có `winston-daily-rotate-file`) kết hợp `morgan`
- **Data Processing:** `xlsx` (Đọc/Ghi file Excel & CSV)
- **Testing:** Node.js Native Test Runner (`node --test`) kết hợp `supertest`
- **Tiện ích khác:** `cors`, `dotenv`

---

## 🚀 Hướng Dẫn Cài Đặt (Getting Started)

### 1. Yêu Cầu Hệ Thống
- [Node.js](https://nodejs.org/en/) >= 20.x
- [Supabase Project](https://supabase.com/) đã được thiết lập.

### 2. Cài Đặt Thư Viện
```bash
npm install
```

### 3. Cấu Hình Môi Trường
Sao chép `.env.example` thành `.env.development` và điền các thông tin bảo mật của Supabase & JWT:
```env
PORT=3000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_secret_key
JWT_SECRET=your_super_secret_jwt_key
ORDER_MODULE_ACTIVE=false
```

### 4. Khởi Chạy Ứng Dụng
```bash
# Môi trường phát triển (có hot-reload bằng node --watch)
npm run dev

# Môi trường Production
npm start
```

---

## 🧪 Kiểm Thử (Testing)

Dự án sử dụng Test Runner gốc của Node.js cho các test chạy ổn định không phụ thuộc DB thật. Trạng thái hiện tại: main suite pass 38/38, không còn test bị skip. Các luồng Supabase nên được kiểm thử riêng bằng môi trường integration khi có database staging.
```bash
# Chạy test unit/API không phụ thuộc DB thật
npm test
```

---

## 🗄️ Database Setup

- **Dựng Supabase project mới:** chạy `supabase-schema.sql` trong Supabase SQL Editor.
- **Nâng DB cũ cho khớp code hiện tại:** chạy `schema-update-align-code.sql` sau các migration nền như `schema-update-tenant.sql`, `schema-update-crud.sql`, `schema-update-settings.sql`, `schema-update-audit.sql`, và `schema-update-assets.sql` nếu DB cũ chưa có các bảng tương ứng.
- **Lưu ý Order/Inventory:** bảng `orders` vẫn có trong schema để giữ contract dữ liệu, nhưng runtime API mặc định inactive cho tới khi bật `ORDER_MODULE_ACTIVE=true`.

---

## 📂 Cấu Trúc Thư Mục (Project Structure)

```text
king-tech-be/
├── scripts/                # Kịch bản giả lập dữ liệu (Seed Data)
├── src/
│   ├── config/             # Cấu hình môi trường (Dotenv)
│   ├── container.js        # Cấu hình DI Container (Awilix)
│   ├── app.js              # Khởi tạo Express App & Middleware
│   ├── controllers/        # Tiếp nhận HTTP Request và Trả về HTTP Response
│   ├── services/           # Xử lý Logic Nghiệp vụ (Business Logic)
│   ├── repositories/       # Xử lý truy vấn CSDL (Supabase/Database)
│   ├── middlewares/        # Xác thực, Rate Limit, Bắt Lỗi...
│   ├── models/             # Khởi tạo instance kết nối DB
│   ├── routes/             # Khai báo các đường dẫn API
│   ├── utils/              # Các hàm hỗ trợ dùng chung (Utils)
│   └── validations/        # Cấu trúc Schema Zod để kiểm duyệt dữ liệu
├── test/                   # Các file Unit/API Test
├── supabase-schema.sql     # Schema chuẩn cho project Supabase mới
└── schema-update-*.sql     # Migration nâng cấp DB hiện hữu
```

---

## 📜 Các Scripts Hỗ Trợ
- **Tạo dữ liệu giả lập (Seed Data):** Kịch bản tạo 100 nhân viên và hơn 2.000 bản ghi chấm công cực kỳ sát thực tế để kiểm thử hệ thống.
  ```bash
  node scripts/seed_100_employees.mjs
  ```

## 🔐 API Endpoints Tiêu Biểu
*(Đảm bảo đã đính kèm `Bearer Token` trong Header cho các endpoint bảo mật)*

- **Auth:** `POST /api/v1/auth/login`
- **Employee:** 
  - `GET /api/v1/employees`
  - `POST /api/v1/employees/import`
  - `GET /api/v1/employees/import-template`
- **Attendance:** `POST /api/v1/attendance`
- **Settings:** `GET /api/v1/settings`
- **Orders:** `POST /api/v1/orders` hiện trả `503 module_inactive` mặc định; chỉ bật bằng `ORDER_MODULE_ACTIVE=true` khi tiếp tục phát triển module này.
- **Health:** `GET /health`
