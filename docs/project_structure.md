# Kiến Trúc Dự Án (Project Structure)

Dự án **King Tech Backend** được thiết kế theo mô hình **Clean Architecture** kết hợp với **Dependency Injection (DI)**. Mục tiêu cốt lõi là đảm bảo khả năng mở rộng (Scalability), dễ dàng bảo trì (Maintainability) và hoàn toàn cô lập dữ liệu giữa các doanh nghiệp (Multi-tenant Isolation).

---

## 📂 Cấu Trúc Thư Mục Tổng Quan

```text
king-tech-be/
├── docs/                   # Tài liệu thiết kế, phân tích dự án (PM/PO)
├── scripts/                # Các script giả lập dữ liệu (Seed Data), công cụ hỗ trợ
├── src/                    # Mã nguồn chính của ứng dụng
│   ├── config/             # Cấu hình biến môi trường và thiết lập hệ thống
│   ├── controllers/        # [Layer 1] Lớp giao tiếp HTTP (Xử lý Request/Response)
│   ├── middlewares/        # Các hàm can thiệp giữa Request và Controller (Auth, Rate Limit...)
│   ├── models/             # Kết nối Database và định nghĩa cấu trúc dữ liệu nền tảng
│   ├── repositories/       # [Layer 3] Lớp giao tiếp trực tiếp với Cơ Sở Dữ Liệu
│   ├── routes/             # Khai báo định tuyến API (Endpoints)
│   ├── services/           # [Layer 2] Lớp xử lý Logic Nghiệp vụ cốt lõi
│   ├── utils/              # Các hàm tiện ích dùng chung (Transform, Errors, Logger...)
│   ├── validations/        # Định nghĩa các Schema kiểm duyệt dữ liệu (Zod)
│   ├── dtos/               # [Models] Lớp đóng gói và định hình dữ liệu Request/Response
│   ├── app.js              # Khởi tạo Express, cài đặt Middleware toàn cục
│   └── container.js        # Đăng ký các Module vào Awilix Dependency Injection
├── test/                   # Chứa các kịch bản Unit/API Test không phụ thuộc DB thật
├── README.md               # Tài liệu hướng dẫn cài đặt nhanh
├── package.json            # Quản lý thư viện và scripts NPM
├── supabase-schema.sql     # Schema chuẩn cho Supabase project mới
└── schema-update-*.sql     # Migration nâng cấp DB hiện hữu
```

---

## 🏛️ Kiến Trúc 3 Lớp (3-Tier Architecture)

Toàn bộ luồng dữ liệu (Data flow) của một API Request đi qua 3 lớp tách biệt, không bao giờ nhảy cóc hoặc đi ngược:

1. **Controller (Lớp HTTP):**
   - Nhiệm vụ: Nhận HTTP Request (`req.body`, `req.params`), điều phối việc gọi Service và trả về HTTP Response (`res.status(200)`).
   - Không chứa bất kỳ logic tính toán nghiệp vụ hay truy vấn SQL nào.

2. **Service (Lớp Nghiệp vụ):**
   - Nhiệm vụ: Xử lý quy tắc nghiệp vụ (Business Rules), tính toán, kiểm tra quyền hạn. Nếu cần thao tác dữ liệu, Service sẽ gọi các hàm từ Repository.
   - Hoàn toàn độc lập với HTTP, không biết `req` hay `res` là gì. Điều này giúp hàm Service dễ dàng được tái sử dụng trong các background job hoặc cron job.

3. **Repository (Lớp Dữ liệu):**
   - Nhiệm vụ: Xây dựng các câu lệnh truy vấn tới cơ sở dữ liệu (Supabase/PostgreSQL).
   - Tất cả các thao tác lọc `tenant` để bảo vệ cô lập dữ liệu đều được chặn bắt buộc tại tầng này.

---

## 🛡️ Quản Lý Dữ Liệu Bằng Models (Data Transfer Objects - DTOs)

Một nguyên tắc bất di bất dịch trong kiến trúc hiện tại: **Mọi thao tác làm việc với dữ liệu đầu vào (Request) và đầu ra (Response) đều phải được quản lý bằng Models (DTOs)**.

### 1. Request DTOs (Dữ liệu vào)
Dữ liệu từ Frontend gửi lên, sau khi được xác thực bởi Zod Middleware, sẽ được bọc lại vào các **Request DTO** (ví dụ: `new CreateEmployeeRequestDto(req.body)`). Việc này tạo ra một Model tiêu chuẩn cho Service xử lý, giúp code sạch và dễ đoán hơn.

### 2. Response DTOs (Dữ liệu ra)
Trước khi trả kết quả về cho Frontend, mọi dữ liệu từ DB phải được ném qua bộ lọc **Response DTO** (ví dụ: `EmployeeResponseDto.fromEntity(employee)`). 
- **Lợi ích:** DTO hoạt động như một "Người gác cổng". Dù dưới DB có chứa các trường nhạy cảm như `password_hash`, `deleted_at`, chúng sẽ bị triệt tiêu hoàn toàn tại lớp DTO, tuyệt đối không lọt ra ngoài API.

---

## 💉 Dependency Injection (DI) với Awilix

Dự án áp dụng chặt chẽ nguyên lý Đảo ngược Phụ thuộc (Dependency Inversion - chữ D trong SOLID) thông qua thư viện `Awilix`.

### 1. Tại sao dùng DI?
Thực trạng cũ (Anti-pattern): Controller trực tiếp `import` Service, Service trực tiếp `import` Repository. Nếu dự án phình to, điều này gây ra vòng lặp import (Circular Dependency) và việc viết Unit Test cho một Service trở thành ác mộng vì phải kết nối DB thật.

Giải pháp hiện tại: Mọi phụ thuộc được "tiêm" vào (Inject) qua hàm khởi tạo `constructor`. 

### 2. Container Tập Trung (`src/container.js`)
Mọi Service và Repository được khai báo ở đây dưới dạng `asClass`. Service dùng lifetime `scoped()` để mỗi request scope có instance riêng khi cần; Repository dùng `singleton()` vì chỉ giữ Supabase client stateless.

Ví dụ:
```javascript
export class EmployeeService {
  constructor({ employeeRepository, auditLogService }) {
    this.employeeRepository = employeeRepository;
    this.auditLogService = auditLogService;
  }
}
```
Container sẽ tự tìm class `EmployeeRepository` và class `AuditLogService` để nhét vào khi `EmployeeService` được gọi.

### 3. Request-Scoped DI (`src/app.js`)
Điểm độc đáo nhất của kiến trúc này là cơ chế sinh ra một "Bản sao không gian" (Scope) cho mỗi API Request:

```javascript
app.use((req, res, next) => {
  // Tạo scope độc lập cho request này
  req.container = container.createScope();
  // ...
  next();
});
```

Điều này có ý nghĩa gì?
- Service được resolve trong scope của request, giúp tránh lưu nhầm state nghiệp vụ giữa các request nếu service cần state trong tương lai.
- Repository vẫn là singleton stateless; tenant isolation vẫn phải được thực thi bằng cách truyền `user.tenant` xuống repository query.

---

## 🛡️ Hệ Thống Bảo Mật & Xác Thực
1. **JWT & Auth Middleware:** Token được gắn vào Header. Nếu hợp lệ, hệ thống trích xuất `tenant` và `user_id` gán thẳng vào `req.user`. Từ đó, dữ liệu của công ty nào thì nhân viên công ty đó mới truy cập được.
2. **Rate Limiting:** Giảm spam request và brute-force cơ bản bằng việc giới hạn số lượng truy cập từ 1 IP trong một tiến trình Node.js.
3. **Zod Validation:** Bộ kiểm duyệt dữ liệu ở Router Middleware. Chặn đứng các payload sai định dạng trước khi chúng kịp tới Controller.

---

## 📋 Hệ Thống Ghi Nhận Nhật Ký (Logging)
Hệ thống được trang bị bộ đôi **Winston** và **Morgan** để theo dõi lỗi chuẩn xác:
- **Morgan (HTTP Tracker):** Tự động ghi nhận mọi Request HTTP (Method, URL, Status Code, Thời gian phản hồi).
- **Winston (Application Logger):** 
  - Thay thế toàn bộ `console.log/error`.
  - Sử dụng cơ chế `Daily Rotate File` để tự động cắt file log theo ngày (`application-YYYY-MM-DD.log`, `error-YYYY-MM-DD.log`).
  - Toàn bộ log lỗi (`[error]`) đều ghim kèm Stack Trace và Request ID để thuận tiện debug.

---

## 🧪 Chiến Lược Viết Test
Nhờ kiến trúc DI, các file `test/*.test.js` có thể test logic nhanh mà không cần kết nối Supabase thật.
- Với service thuần logic, có thể inject fake repository để kiểm soát dữ liệu đầu vào/đầu ra.
- Với các luồng repository và tenant isolation thật, nên chạy thêm nhóm integration test riêng trên Supabase staging.

---

## 🗄️ Schema & Migration
- `supabase-schema.sql`: nguồn schema chuẩn để dựng Supabase project mới từ đầu.
- `schema-update-align-code.sql`: migration tổng hợp để đưa DB cũ về đúng contract hiện tại của backend (`stock/status`, `check_in/check_out`, `tenant`, `deleted_at`, audit/assets).
- Các file `schema-update-*.sql` còn lại là migration theo từng chủ đề, dùng khi DB hiện hữu thiếu phần tương ứng.
