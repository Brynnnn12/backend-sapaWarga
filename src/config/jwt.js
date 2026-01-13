import jwt from "jsonwebtoken";

export const generateToken = (userId, role) => {
  const payload = {
    id: userId,
    role: role, // Tambahkan role ke payload
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET || "your_default_secret_key",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d", // Diperpanjang jadi 7 hari
    }
  );

  return token; // Return token saja, tanpa set cookie
};

// Fungsi untuk verifikasi token JWT
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_default_secret_key"
    );
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};
