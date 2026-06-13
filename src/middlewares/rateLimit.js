const rateLimitMap = new Map();

/**
 * Creates an in-memory rate limiter middleware.
 * @param {object} options
 * @param {number} options.windowMs - Time window in milliseconds (default: 1 minute)
 * @param {number} options.max - Max requests allowed per IP in the window (default: 60)
 * @param {string} options.message - Error message to return when rate limited
 * @returns {Function} Express middleware
 */
export function createRateLimiter({ 
  windowMs = 60 * 1000, 
  max = 60, 
  message = "Too many requests, please try again later." 
} = {}) {
  return (req, res, next) => {
    // Get IP address from request
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const now = Date.now();

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, []);
    }

    let timestamps = rateLimitMap.get(ip);
    
    // Filter out timestamps outside the current window
    timestamps = timestamps.filter(t => now - t < windowMs);

    if (timestamps.length >= max) {
      return res.status(429).json({
        success: false,
        message,
      });
    }

    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);
    
    next();
  };
}
