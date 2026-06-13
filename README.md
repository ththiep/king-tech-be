# King Tech Backend 🚀

King Tech Backend là hệ thống RESTful API cấp doanh nghiệp, được xây dựng theo mô hình **SaaS Đa Doanh Nghiệp (Multi-Tenant)**. Nền tảng này đóng vai trò lõi xử lý dữ liệu cho các phân hệ: Quản trị Nhân sự (HRM), Quản lý Chấm công (Attendance), và Bán hàng nhỏ lẻ (Sales/Inventory).

## ✨ Tính Năng Nổi Bật (Key Features)
- **Multi-Tenancy & Data Isolation:** Mỗi doanh nghiệp (Tenant) sở hữu một không gian dữ liệu độc lập. Dữ liệu được bảo vệ tuyệt đối và cô lập thông qua JWT Token và các lớp truy vấn cấp thấp.
- **Clean Architecture + SOLID:** Tuân thủ kiến trúc 3 lớp (Controller -> Service -> Repository) giúp dễ dàng bảo trì và mở rộng.
- **Dependency Injection (DI):** Sử dụng `Awilix` để tiêm phụ thuộc theo phạm vi Request (Request-Scoped), loại bỏ hoàn toàn tình trạng Import chéo (Spaghetti code).
- **Security & Protection:** 
  - Mã hóa mật khẩu an toàn.
  - Tích hợp `Rate Limiter` chống tấn công DDoS/Brute-force.
  - Bảo mật dữ liệu tải lên với Multer.
- **Audit Logs:** Tự động lưu vết lịch sử mọi thao tác thay đổi dữ liệu của Admin.
- **Nhập/Xuất Excel (Batch Operations):** Hỗ trợ cực mạnh cho thao tác số lượng lớn với khả năng phân tích và Import file Excel/CSV thông minh.

## 🛠 Tech Stack
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js
- **Database / BaaS:** Supabase (PostgreSQL)
- **Dependency Injection:** Awilix
- **Validation:** Zod
- **Authentication:** JSON Web Token (JWT) + Bcrypt
- **Testing:** Node.js Native Test Runner (`node --test`)
- **Khác:** Multer, xlsx, dotenvx

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
```

### 4. Khởi Chạy Ứng Dụng
```bash
# Môi trường phát triển (có hot-reload bằng node --watch)
npm run dev

# Môi trường Producton
npm start
```

---

## 🧪 Kiểm Thử (Testing)

Dự án có độ phủ Test cao (100% PASS) sử dụng Test Runner gốc của Node.js, không cần thư viện ngoài.
```bash
# Chạy toàn bộ Unit/Integration Tests
npm test
```

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
└── test/                   # Các file Unit Test và Setup
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
- **Health:** `GET /health`
