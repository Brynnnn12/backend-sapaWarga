import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Untuk mendapatkan __dirname di ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfigurasi storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Simpan di folder public/uploads di luar src
    const uploadPath = path.join(__dirname, "../../public/uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Format nama: timestamp-randomstring-originalname.ext
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const cleanName = nameWithoutExt
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();
    cb(null, `${uniqueSuffix}-${cleanName}${ext}`);
  },
});

// Filter file - hanya jpg dan png
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file JPG dan PNG yang diperbolehkan!"), false);
  }
};

// Konfigurasi upload
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maksimal 5MB
  },
});
