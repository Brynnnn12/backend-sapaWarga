import rateLimit from "express-rate-limit";

// Rate limiter untuk auth endpoints (login/register)
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Maksimal 5 request per window per IP
  message: {
    success: false,
    message: "Terlalu banyak request. Coba lagi dalam 15 menit.",
  },
  standardHeaders: true, // Return rate limit info di headers `RateLimit-*`
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Rate limiter umum untuk API lainnya
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimal 100 request per window per IP
  message: {
    success: false,
    message: "Terlalu banyak request. Coba lagi dalam 15 menit.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
