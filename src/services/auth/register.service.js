import bcrypt from "bcrypt";
import { prisma } from "../../config/database.js";

export const registerService = async (name, email, password) => {
  // Cek apakah email sudah terdaftar
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email sudah terdaftar");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Buat user baru dengan role "user"
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "user",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};
