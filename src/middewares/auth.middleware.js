import { verifyToken } from "../config/jwt.js";

// Middleware untuk cek apakah user sudah login
export const isLogin = (req, res, next) => {
  try {
    // Extract token dari header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan. Silakan login terlebih dahulu.",
      });
    }

    // Remove 'Bearer ' prefix
    const token = authHeader.substring(7);

    // Verifikasi token
    const { valid, decoded, error } = verifyToken(token);

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau sudah expired.",
        error: error,
      });
    }

    // Simpan data user ke request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server authentication.",
    });
  }
};

// Middleware untuk cek apakah user adalah admin
export const isAdmin = (req, res, next) => {
  try {
    // Pastikan user sudah terautentikasi (isLogin sudah dijalankan)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication diperlukan.",
      });
    }

    // Cek role user
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Hanya admin yang dapat mengakses fitur ini.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin check middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};

// Middleware untuk cek apakah user adalah pemilik resource (user biasa)
export const isOwner = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication diperlukan.",
      });
    }

    const resourceUserId =
      parseInt(req.params.userId) || parseInt(req.params.id);

    if (req.user.id !== resourceUserId) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Anda hanya dapat mengakses data sendiri.",
      });
    }

    next();
  } catch (error) {
    console.error("Owner check middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};
