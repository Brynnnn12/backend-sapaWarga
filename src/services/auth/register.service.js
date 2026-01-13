import { prisma } from "../../config/database.js";
import bcrypt from "bcrypt";

// src/services/auth/register.service.js
export const registerService = async ({ name, email, password }) => {
  // Pastikan email tidak undefined (tadi sudah kita debug, email sudah masuk)
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email, // Email harus string dan unik di schema
    },
  });

  if (existingUser) {
    throw new Error("Email sudah terdaftar");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "USER",
    },
    select: {
      name: true,
    },
  });

  return user;
};
