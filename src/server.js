import { config } from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB, disconnectDB } from "./config/database.js"; // Tambahkan disconnectDB
import routes from "./routes/index.js";
import errorHandler from "./middewares/error.middleware.js";

config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use("/uploads", express.static("public/uploads"));

app.get("/", (req, res) => {
  res.send("Selamat datang di API Sapa Warga!");
});

// API Routes
app.use("/api/v1", routes);

// 404 Not Found Handler - harus ditempatkan setelah semua routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
    path: req.originalUrl,
    method: req.method,
  });
});

// Error Handler Middleware
app.use(errorHandler);

// Simpan instance server ke dalam variabel
const server = app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

// --- Graceful Shutdown Handling ---

const shutdown = async (signal) => {
  console.log(`\n${signal} diterima. Menutup server...`);
  server.close(async () => {
    console.log("Server HTTP ditutup.");
    await disconnectDB();
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT")); // Menangani Ctrl+C

process.on("unhandledRejection", async (err) => {
  console.error("Unhandled Rejection:", err);
  // Opsional: Tutup server dengan error code 1
  await disconnectDB();
  process.exit(1);
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});
