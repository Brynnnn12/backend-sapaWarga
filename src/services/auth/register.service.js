import { prisma } from "../../config/database.js";
import bcrypt from "bcrypt";

export const registerService = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
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
