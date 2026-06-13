import multer from "multer";

// Dùng memory storage để đọc buffer thay vì lưu file vật lý xuống ổ cứng
const storage = multer.memoryStorage();

export const uploadExcelMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn file 5MB
  fileFilter: (req, file, cb) => {
    // Chỉ cho phép upload file excel hoặc csv
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
      "application/vnd.ms-excel", // xls
      "text/csv" // csv
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận định dạng Excel hoặc CSV."));
    }
  }
});
