# Báo Cáo Đánh Giá Chất Lượng Mã Nguồn & Cấu Trúc Kỹ Thuật (Technical Code Review)

Báo cáo này được thực hiện bởi Technical Leader/Architect để đánh giá tổng thể độ sạch của mã nguồn, sự tuân thủ các chuẩn mực lập trình và kiến trúc của dự án **King Tech Backend**.

---

## 🏗️ 1. Đánh Giá Cấu Trúc Thư Mục (Directory Structure)

Cấu trúc thư mục của dự án cực kỳ tiêu chuẩn và tuân thủ chặt chẽ mô hình **Clean Architecture**:
- Việc phân mảnh rõ ràng giữa `controllers`, `services`, `repositories`, `routes`, `middlewares`, `validations` giúp các module thực hiện đúng duy nhất một nhiệm vụ (Single Responsibility Principle).
- **Điểm cộng lớn:** Lớp `repositories` (ví dụ `base.repository.js`) chứa toàn bộ logic giao tiếp với Supabase. Việc này che giấu hoàn toàn query SQL khỏi `services`, giúp sau này nếu đổi database (ví dụ sang MySQL hay MongoDB), chúng ta chỉ việc viết lại thư mục `repositories` mà không cần đụng đến `services` hay `controllers`.
- **Tập trung DI:** Thư mục `src` có chứa `container.js` làm trung tâm quản lý Dependency Injection. Rất hiện đại và chuyên nghiệp giống mô hình của NestJS hoặc Spring Boot.

---

## 🏷️ 2. Đánh Giá Tiêu Chuẩn Đặt Tên (Naming Conventions)

Dự án áp dụng các quy chuẩn đặt tên rất khắt khe và nhất quán:

1. **Tập tin (Files):** 
   - Đặt tên theo chuẩn `kebab-case` kết hợp với loại module: `employee.controller.js`, `auditLog.service.js`. Chuẩn này giúp dễ tìm kiếm file và tránh lỗi khi phân phối code lên các hệ điều hành phân biệt hoa/thường (như Linux).
2. **Lớp (Classes):** 
   - Sử dụng chuẩn `PascalCase`: `EmployeeService`, `AttendanceRepository`. Hoàn toàn đúng chuẩn hướng đối tượng (OOP).
3. **Biến & Hàm (Variables & Functions):** 
   - Khai báo biến/instance dùng `camelCase`: `employeeService`, `employeeRepository`.
   - Hàm sử dụng động từ chỉ hành động rõ ràng: `listAttendance`, `upsertAttendance`, `batchCreateEmployees`.
4. **Database (DB Fields):**
   - Supabase dùng chuẩn `snake_case` (ví dụ: `employee_id`, `deleted_at`).
   - Node.js dùng chuẩn `camelCase` (ví dụ: `employeeId`, `deletedAt`).
   - **Cách xử lý tinh tế:** Dự án đã có sẵn các hàm `keysToSnakeCase` và `keysToCamelCase` trong `utils/transform.js` để tự động biến đổi qua lại giữa 2 chuẩn này trước/sau khi gọi Database. Rất gọn gàng!

---

## 💻 3. Đánh Giá Mã Nguồn & Kỹ Thuật Viết Code (Coding Practices)

### 3.1. Phân Quyền Khởi Tạo (Dependency Injection - Awilix)
- Code cũ thường có anti-pattern: `const service = new EmployeeService()`.
- Code hiện tại sử dụng: `const attendanceService = req.container.resolve('attendanceService');`.
- **Đánh giá:** Tốt. Việc nhường quyền khởi tạo class cho Awilix giúp giảm import chéo và làm service dễ test hơn. Service hiện đăng ký `scoped()`, repository giữ `singleton()` vì không chứa request state.

### 3.2. Bắt Lỗi và Kiểm Duyệt (Error Handling & Validation)
- Controller được tinh gọn tối đa bằng khối `try/catch` bắt lỗi ném ra `next(err)`.
- Các lỗi nghiệp vụ ném ra các Class lỗi chuyên biệt: `throw new NotFoundError("Employee not found")`.
- Dữ liệu đầu vào đi qua Zod Middleware (chặn từ cổng `Router`). Riêng import Excel/CSV cũng chạy lại schema batch create ở service để tránh dữ liệu file bypass validation.

### 3.3. Dữ Liệu Quản Lý Bằng Models (Data Transfer Objects)
- Thay vì lấy thẳng object từ DB và ném về Frontend (rất dễ lộ field nhạy cảm), dự án hiện tại tuân thủ 100% nguyên tắc dùng Model/DTO làm ranh giới.
- Mọi kết quả từ DB sẽ đi qua hàm `ResponseDto.fromEntity(data)`. Mọi request đầu vào sẽ đi qua `new RequestDto(req.body)`.
- **Đánh giá:** 10/10. Cơ chế này giúp Backend "đóng băng" contract trả về, đảm bảo API trả ra Frontend không bao giờ bị thừa/thiếu trường dữ liệu.

### 3.4. Bảo Mật & Đa Doanh Nghiệp (Security & Multi-Tenant)
- Tuyệt đối không hardcode `tenant` ID. Tenant được bóc tách từ JWT token thông qua Middleware.
- Bất kỳ API thao tác dữ liệu nào ở `Service` (ví dụ `upsertAttendance`) đều chủ động nhét `tenant: user.tenant` vào dữ liệu ghi và gọi hàm xác thực trước khi cập nhật.

### 3.5. Hệ Thống Logging & Tracing
- Đã loại bỏ hoàn toàn việc phụ thuộc vào `console.error` (dễ mất log khi crash).
- Tích hợp **Winston** và **Morgan**. Ghi nhận log trực tiếp ra các file cắt ngày tự động (`winston-daily-rotate-file`) bằng định dạng JSON.
- **Đánh giá:** Rất cao. Luồng lỗi nay đã được gắn chặt với Stack Trace và Request ID, hoàn toàn sẵn sàng cho môi trường Production và dễ dàng tích hợp ELK stack hoặc Datadog.

---

## ✅ 4. Baseline Kỹ Thuật Hiện Tại

- **Test suite:** `npm test` hiện pass 38/38, không có test bị skip. Các test này tập trung vào unit/API logic không phụ thuộc Supabase thật.
- **Schema:** `supabase-schema.sql` là schema chuẩn cho project mới; `schema-update-align-code.sql` dùng để nâng DB cũ về đúng contract code hiện tại.
- **Feature flags:** Order/Inventory đang inactive mặc định qua `ORDER_MODULE_ACTIVE=false`; API order trả `503 module_inactive` nếu chưa bật flag.
- **Production config:** App sẽ fail fast trong production nếu thiếu `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, hoặc `JWT_SECRET`.

---

## 🔍 5. Kết Luận & Đề Xuất Cải Tiến Nhỏ

Dự án hiện tại có nền kiến trúc gọn, dễ đọc và dễ mở rộng. Các phần active chính là Auth, Employee, Attendance, Settings, Upload; module Order/Inventory đang được đánh dấu inactive ở runtime.

**Một vài cải tiến nhỏ có thể làm trong tương lai:**
1. **Dùng TS (TypeScript):** Vì dự án đang dùng JSDoc hoặc Vanilla JS, khi số lượng model lên tới hàng chục cái, việc chuyển đổi dự án sang TypeScript sẽ giúp kiểm soát kiểu dữ liệu mạnh hơn (tránh gõ sai tên trường dữ liệu).
2. **Integration Test Supabase:** Main test suite hiện tránh phụ thuộc DB thật. Khi có database staging, nên bổ sung nhóm test riêng cho tenant isolation và repository query.
3. **Audit toàn hệ thống:** Audit log hiện tập trung ở Employee. Product, Settings, Upload và các module tương lai cần bổ sung log trước khi công bố là audit toàn hệ thống.
