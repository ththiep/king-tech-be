# Bảng Theo Dõi Tính Năng Sản Phẩm (Product Feature Checklist)

Dưới đây là danh sách chi tiết các tính năng đã hoàn thành (Implemented) và các tính năng đang chờ xử lý (Pending), kèm theo mô tả ngắn gọn về vai trò nghiệp vụ của từng tính năng.

Quy ước trạng thái: `[x]` đã active, `[~]` đã có một phần nhưng chưa phủ đủ production, `[ ]` chưa active hoặc chưa triển khai.

---

## 🔒 1. Xác Thực & Đa Doanh Nghiệp (Auth & Multi-Tenancy)

*   `[x]` **Đăng nhập Admin (Admin Login):** Xác thực tài khoản Admin của từng Tenant bằng cơ chế mã hóa mật khẩu Bcrypt và ký mã token JWT.
*   `[x]` **Cô lập dữ liệu (Tenant Isolation):** Tự động lọc toàn bộ câu truy vấn cơ sở dữ liệu dựa trên Tenant lấy từ JWT token của người dùng hiện tại, ngăn chặn truy cập trái phép chéo giữa các doanh nghiệp.
*   `[ ]` **Cổng đăng ký Tenant mới (Tenant Onboarding Portal):** Giao diện hoặc API tự phục vụ (Self-service) cho phép tạo mới hồ sơ Tenant và cấu hình cơ sở dữ liệu ban đầu một cách tự động.
*   `[ ]` **Cấp lại mật khẩu (Password Recovery):** Quy trình gửi mail hoặc xác thực mã OTP để đặt lại mật khẩu cho tài khoản Admin khi bị quên.

---

## 👥 2. Quản Lý Nhân Sự (Employee Management)

*   `[x]` **Quản lý thông tin nhân sự (Employee CRUD):** Thêm, sửa, xem chi tiết và xóa nhân viên với bộ kiểm duyệt Zod Validation chặt chẽ.
*   `[x]` **Thao tác hàng loạt (Batch Operations):** Hỗ trợ thêm hàng loạt (Batch Create) và xóa hàng loạt (Batch Delete) nhân viên trong một request duy nhất để tối ưu hiệu năng.
*   `[x]` **Bộ lọc & Tìm kiếm nâng cao:** Tìm kiếm nhân viên theo tên/mã số, phân trang dữ liệu, và lọc theo phòng ban hoặc trạng thái hoạt động.
*   `[x]` **Xuất Excel/CSV (Export CSV):** Hỗ trợ kết xuất danh sách nhân viên hiện tại ra file CSV, định dạng UTF-8 BOM chống lỗi font tiếng Việt khi mở bằng Excel.
*   `[x]` **Nhập dữ liệu hàng loạt từ Excel (Import CSV/Excel):** Cho phép upload file Excel chứa danh sách hàng trăm nhân sự lên hệ thống để Backend tự phân tích và cập nhật vào DB. Đã cung cấp sẵn Endpoint `/api/v1/employees/import-template` để tải file CSV mẫu cho người dùng.

---

## 📅 3. Quản Lý Chấm Công (Attendance Management)

*   `[x]` **Chấm công hàng ngày (Daily Timekeeping):** Ghi nhận trạng thái chuyên cần (`Có mặt`, `Trễ`, `Nghỉ phép`, `Vắng`) cùng số giờ làm việc thực tế và làm thêm giờ (OT) của từng nhân viên.
*   `[x]` **Bảo mật ghi nhận chấm công (Attendance Security):** Kiểm tra đối chiếu nhân sự thuộc quyền quản lý của Tenant trước khi cho phép Upsert bản ghi chấm công, tránh ghi đè dữ liệu sai.
*   `[ ]` **Bảng tổng hợp công tháng (Monthly Summary):** Công cụ tổng hợp tự động số ngày công, tổng giờ làm, và số lần đi muộn của từng nhân viên trong tháng để chuẩn bị dữ liệu tính lương.
*   `[ ]` **Cấu hình ca làm việc (Shift Settings):** Cho phép doanh nghiệp thiết lập khung giờ chuẩn (Ví dụ: 08:30 - 17:30) để hệ thống tự động đánh dấu trạng thái đi muộn (`late`) khi nhân viên check-in thực tế.

---

## 📦 4. Quản Lý Sản Phẩm & Kho (Product Catalog & Inventory)

*   `[x]` **Quản lý danh mục sản phẩm (Product CRUD):** Quản lý tên sản phẩm, mã SKU, phân loại sản phẩm, giá bán và số lượng tồn kho.
*   `[ ]` **Kiểm tra tồn kho khi đặt hàng:** Chưa active vì module Order/Inventory Deduction đang tạm đóng.
*   `[ ]` **Tự động trừ kho (Inventory Deduction):** Chưa active; endpoint order hiện trả `503 module_inactive` mặc định để tránh chạy logic chưa hoàn thiện.
*   `[ ]` **Cảnh báo hết hàng (Low Stock Alert):** Tự động phát thông báo hoặc đổi trạng thái cảnh báo khi số lượng tồn kho của một sản phẩm chạm ngưỡng tối thiểu.

---

## 🛒 5. Quản Lý Đơn Hàng (Order Management)

*   `[ ]` **Quản lý đơn hàng (Order CRUD):** Module chưa active ở runtime. Chỉ bật lại bằng `ORDER_MODULE_ACTIVE=true` khi quay lại phát triển.
*   `[ ]` **Giao dịch cơ sở dữ liệu (Database Transaction):** Sẽ cần thiết nếu tiếp tục module order/inventory trong tương lai.
*   `[ ]` **Hóa đơn & In ấn (Invoice Export):** Hỗ trợ xuất hóa đơn đơn hàng ra định dạng PDF để in ấn hoặc gửi email xác nhận tự động cho khách hàng.

---

## ⚙️ 6. Cấu Hình Hệ Thống & Bảo Mật (Settings & System)

*   `[x]` **Kiến trúc 3 lớp (3-Tier Architecture):** Tổ chức mã nguồn chuẩn doanh nghiệp (Route -> Controller -> Service -> Repository) giúp dễ bảo trì và mở rộng.
*   `[x]` **Tùy biến nhãn doanh nghiệp (Custom Tenant Labels):** Cho phép từng Tenant tùy biến nhãn và màu sắc hiển thị cho Phòng ban, Trạng thái chấm công và Trạng thái làm việc.
*   `[x]` **Bộ chặn giới hạn tần suất (Rate Limiter):** Giảm brute-force mật khẩu và spam upload bằng giới hạn request theo IP trong một tiến trình Node.js.
*   `[x]` **Tách biệt môi trường (.env.development & .env.production):** Cấu hình linh hoạt thông qua các file môi trường độc lập và VS Code debugger.
*   `[~]` **Nhật ký hệ thống (Audit Logs):** Đã lưu vết thao tác nhân sự. Cần mở rộng cho Product, Settings, Upload và các module khác trước khi coi là hoàn chỉnh toàn hệ thống.
