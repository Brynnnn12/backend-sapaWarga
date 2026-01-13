import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const prisma = new PrismaClient({
  adapter: new PrismaPg(new Pool({ connectionString })),
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["warn", "error"],
});
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Berhasil terhubung ke database.");
  } catch (error) {
    console.error("❌ Gagal terhubung ke database:", error);
    process.exit(1); // Keluar dari proses jika gagal terhubung
  }
};

const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log("✅ Terputus dari database.");
  } catch (error) {
    console.error("❌ Gagal memutuskan koneksi database:", error);
    process.exit(1); // Keluar dari proses jika gagal memutuskan koneksi
  }
};
export { connectDB, disconnectDB, prisma };
