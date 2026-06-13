import { ApiResponse } from "../utils/response.js";
import { BadRequestError } from "../utils/errors.js";

export async function upload(req, res, next) {
  try {
    const uploadService = req.container.resolve('uploadService');
    const { file, name } = req.body;
    if (!file) {
      throw new BadRequestError("File is required");
    }

    const publicUrl = await uploadService.uploadBase64Image(file, req.user.tenant);
    
    if (publicUrl === file && file.startsWith("data:image/")) {
      throw new BadRequestError("Failed to upload image");
    }

    ApiResponse.success(res, { url: publicUrl }, "File uploaded successfully", 200);
  } catch (err) {
    next(err);
  }
}
