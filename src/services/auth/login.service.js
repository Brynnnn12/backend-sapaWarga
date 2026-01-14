import bcrypt from "bcrypt";
import { prisma } from "../../config/database.js";
import { generateToken } from "../../config/jwt.js";

export const loginService = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Password salah");
  }

  const token = generateToken(user.id, user.role);

  return {
    token,
    user: {
      name: user.name,
    },
  };
};
