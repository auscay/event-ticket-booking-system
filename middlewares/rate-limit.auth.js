import rateLimit from 'express-rate-limit';

const bookLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit to 10 bookings per minute
    message: {
      message: "Too many bookings from this IP, please try again later.",
      success: false,
    },
    headers: true,
  });
  
  const cancelLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // Limit to 3 cancellations per minute
    message: {
      message: "Too many cancellations from this IP, please try again later.",
      success: false,
    },
    headers: true,
  });

  export { bookLimiter, cancelLimiter };