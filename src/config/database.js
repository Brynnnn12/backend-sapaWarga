import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Berhasil terhubung ke database (Prisma 7 Mode)");
  } catch (error) {
    console.error("❌ Gagal terhubung:", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log("✅ Database Disconnected");
  } catch (error) {
    console.error("❌ Disconnection Error:", error);
  }
};
