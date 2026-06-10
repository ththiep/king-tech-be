export class ApiResponse {
  static success(res, data = null, message = "Success", statusCode = 200, meta = null) {
    const response = {
      success: true,
      message,
      data,
    };
    
    if (meta) {
      response.meta = meta;
    }
    
    return res.status(statusCode).json(response);
  }

  static error(res, message = "Error occurred", statusCode = 500, errorDetails = null) {
    const response = {
      success: false,
      message,
    };
    
    if (errorDetails) {
      response.error = errorDetails;
    }
    
    return res.status(statusCode).json(response);
  }
}
