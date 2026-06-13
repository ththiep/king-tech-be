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
│   ├── utils/              # Các hàm tiện ích dùng chung (Transform, Errors...)
│   ├── validations/        # Định nghĩa các Schema kiểm duyệt dữ liệu (Zod)
│   ├── app.js              # Khởi tạo Express, cài đặt Middleware toàn cục
│   └── container.js        # Đăng ký các Module vào Awilix Dependency Injection
├── test/                   # Chứa các kịch bản Unit Test và Integration Test
├── README.md               # Tài liệu hướng dẫn cài đặt nhanh
├── package.json            # Quản lý thư viện và scripts NPM
└── schema-update-audit.sql # Script SQL để cập nhật cấu trúc bảng trên Supabase
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

## 💉 Dependency Injection (DI) với Awilix

Dự án áp dụng chặt chẽ nguyên lý Đảo ngược Phụ thuộc (Dependency Inversion - chữ D trong SOLID) thông qua thư viện `Awilix`.

### 1. Tại sao dùng DI?
Thực trạng cũ (Anti-pattern): Controller trực tiếp `import` Service, Service trực tiếp `import` Repository. Nếu dự án phình to, điều này gây ra vòng lặp import (Circular Dependency) và việc viết Unit Test cho một Service trở thành ác mộng vì phải kết nối DB thật.

Giải pháp hiện tại: Mọi phụ thuộc được "tiêm" vào (Inject) qua hàm khởi tạo `constructor`. 

### 2. Container Tập Trung (`src/container.js`)
Mọi Service và Repository được khai báo ở đây dưới dạng `asClass`. Khi hệ thống khởi động, Container sẽ tự động "nối" các Repository vào Service phù hợp dựa trên tên tham số.

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
- Nó đảm bảo rằng các Service hoạt động trong **Request A** hoàn toàn độc lập bộ nhớ với **Request B**. 
- Dữ liệu rác không bị lưu lại giữa các lần gọi API. Rủi ro memory leak hoặc rò rỉ dữ liệu phiên làm việc là 0%.

---

## 🛡️ Hệ Thống Bảo Mật & Xác Thực
1. **JWT & Auth Middleware:** Token được gắn vào Header. Nếu hợp lệ, hệ thống trích xuất `tenant` và `user_id` gán thẳng vào `req.user`. Từ đó, dữ liệu của công ty nào thì nhân viên công ty đó mới truy cập được.
2. **Rate Limiting:** Chống spam request và tấn công DDoS bằng việc giới hạn số lượng truy cập từ 1 IP.
3. **Zod Validation:** Bộ kiểm duyệt dữ liệu ở Router Middleware. Chặn đứng các payload sai định dạng trước khi chúng kịp tới Controller.

---

## 🧪 Chiến Lược Viết Test
Nhờ kiến trúc DI, các file `test/*.test.js` hoạt động độc lập và cô lập rất nhanh.
- Để test một logic (ví dụ `uploadService`), chỉ cần gọi `container.resolve('uploadService')`.
- Không cần Mock dữ liệu thủ công hay dùng `jest.mock`. Khả năng kiểm thử (Testability) đạt mức tối đa.
