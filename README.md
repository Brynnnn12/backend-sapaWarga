# Backend Sapa Warga

Backend API untuk sistem pengaduan warga desa yang simpel dan efektif. Project ini dikembangkan menggunakan metodologi **Agile Sprint** dengan fokus pada kemudahan penggunaan dan fungsionalitas yang jelas.

## 📋 Deskripsi Project

**Sapa Warga** adalah sistem pengaduan berbasis web yang memungkinkan warga untuk melaporkan keluhan atau masalah di lingkungan mereka, sementara perangkat desa (admin) dapat mengelola dan merespons laporan tersebut secara efisien.

### Role-Based System

- **User (Warga)**: Dapat membuat laporan, melihat laporan pribadi, dan membalas komentar
- **Admin (Perangkat Desa)**: Dapat melihat semua laporan, mengubah status, dan memberikan tanggapan

---

## 🗄️ Database Schema (ERD)

### 1. Tabel `users`

Menyimpan data pengguna (warga dan admin)

| Field      | Type         | Description             |
| ---------- | ------------ | ----------------------- |
| id         | INT (PK)     | Primary Key             |
| name       | VARCHAR(100) | Nama lengkap pengguna   |
| email      | VARCHAR(100) | Email/username (unique) |
| password   | VARCHAR(255) | Password (hashed)       |
| role       | ENUM         | 'admin' atau 'user'     |
| created_at | TIMESTAMP    | Waktu pembuatan akun    |

### 2. Tabel `complaints`

Menyimpan data laporan pengaduan

| Field       | Type         | Description                    |
| ----------- | ------------ | ------------------------------ |
| id          | INT (PK)     | Primary Key                    |
| user_id     | INT (FK)     | Foreign Key ke users           |
| title       | VARCHAR(200) | Judul laporan                  |
| description | TEXT         | Detail laporan                 |
| image       | VARCHAR(255) | Nama file foto bukti           |
| status      | ENUM         | 'pending', 'proses', 'selesai' |
| created_at  | TIMESTAMP    | Waktu pembuatan laporan        |
| updated_at  | TIMESTAMP    | Waktu update terakhir          |

### 3. Tabel `comments`

Menyimpan komentar/tanggapan pada laporan

| Field        | Type      | Description               |
| ------------ | --------- | ------------------------- |
| id           | INT (PK)  | Primary Key               |
| complaint_id | INT (FK)  | Foreign Key ke complaints |
| user_id      | INT (FK)  | Foreign Key ke users      |
| message      | TEXT      | Isi komentar/balasan      |
| created_at   | TIMESTAMP | Waktu pembuatan komentar  |

---

## 🎯 Fitur Berdasarkan Role

### User (Warga)

- ✅ Registrasi dan login
- ✅ Membuat laporan pengaduan baru (dengan upload foto)
- ✅ Melihat daftar laporan milik sendiri
- ✅ Melihat detail laporan milik sendiri
- ✅ Membalas komentar dari admin
- ✅ Melihat status laporan (pending/proses/selesai)

### Admin (Perangkat Desa)

- ✅ Login sebagai admin
- ✅ Melihat semua laporan masuk
- ✅ Mengubah status laporan (pending → proses → selesai)
- ✅ Memberikan tanggapan/solusi pada laporan
- ✅ Melihat detail lengkap setiap laporan
- ✅ Dashboard statistik laporan (future sprint)

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL / PostgreSQL
- **Authentication**: JWT (JSON Web Token)
- **File Upload**: Multer
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Environment**: dotenv

---

## 📦 Installation

### Prerequisites

- Node.js (v14 atau lebih baru)
- MySQL/PostgreSQL
- npm atau yarn

### Setup Instructions

1. **Clone repository**

```bash
git clone <repository-url>
cd backend-sapaWarga
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**
   Buat file `.env` di root folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sapa_warga
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. **Setup database**

```bash
# Buat database
# Import schema SQL atau jalankan migration
```

5. **Run development server**

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

---

## 🚀 API Endpoints

### Authentication

| Method | Endpoint             | Description      | Access |
| ------ | -------------------- | ---------------- | ------ |
| POST   | `/api/auth/register` | Registrasi user  | Public |
| POST   | `/api/auth/login`    | Login user/admin | Public |

### Complaints (Laporan)

| Method | Endpoint                     | Description           | Access      |
| ------ | ---------------------------- | --------------------- | ----------- |
| POST   | `/api/complaints`            | Buat laporan baru     | User        |
| GET    | `/api/complaints`            | List laporan          | User, Admin |
| GET    | `/api/complaints/:id`        | Detail laporan        | User, Admin |
| PATCH  | `/api/complaints/:id/status` | Update status laporan | Admin       |
| DELETE | `/api/complaints/:id`        | Hapus laporan         | User, Admin |

### Comments (Komentar)

| Method | Endpoint                       | Description               | Access      |
| ------ | ------------------------------ | ------------------------- | ----------- |
| POST   | `/api/complaints/:id/comments` | Tambah komentar/tanggapan | User, Admin |
| GET    | `/api/complaints/:id/comments` | List komentar             | User, Admin |

### Users

| Method | Endpoint             | Description      | Access |
| ------ | -------------------- | ---------------- | ------ |
| GET    | `/api/users/profile` | Get user profile | User   |
| PATCH  | `/api/users/profile` | Update profile   | User   |

---

## 📁 Project Structure

```
backend-sapaWarga/
├── src/
│   ├── config/
│   │   └── database.js          # Konfigurasi database
│   ├── controllers/
│   │   ├── authController.js    # Logic authentication
│   │   ├── complaintController.js
│   │   └── commentController.js
│   ├── middlewares/
│   │   ├── auth.js              # Middleware autentikasi JWT
│   │   ├── roleCheck.js         # Middleware cek role
│   │   └── upload.js            # Middleware upload file
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── commentRoutes.js
│   ├── utils/
│   │   └── response.js          # Helper response format
│   └── server.js                # Entry point
├── public/
│   └── uploads/                 # Folder upload foto
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## 🔐 Middleware Authentication

### 1. `isLogin` - Validasi JWT Token

Mengecek apakah user sudah login dengan token yang valid.

### 2. `isAdmin` - Validasi Role Admin

Memastikan hanya admin yang bisa akses endpoint tertentu.

**Contoh penggunaan:**

```javascript
router.patch("/complaints/:id/status", isLogin, isAdmin, updateStatus);
```

---

## 📸 File Upload Configuration

Menggunakan **Multer** untuk upload foto bukti laporan:

- Folder penyimpanan: `public/uploads/`
- Format yang diterima: `.jpg`, `.jpeg`, `.png`
- Max file size: 5MB
- File naming: `complaint-{timestamp}-{originalname}`

---

## 🏃 Agile Sprint Planning

### Sprint 1 (Week 1) - Setup & Authentication ✅ (Current)

- [x] Setup project structure
- [x] Database schema design
- [ ] Implementasi authentication (register, login)
- [ ] Middleware JWT dan role-based access
- [ ] Testing authentication flow

### Sprint 2 (Week 2) - Complaint Management

- [ ] CRUD complaints (User side)
- [ ] Upload foto dengan Multer
- [ ] Filter laporan berdasarkan user
- [ ] Admin view all complaints

### Sprint 3 (Week 3) - Status & Comments

- [ ] Admin update status laporan
- [ ] Sistem komentar/tanggapan
- [ ] Notifikasi status update (optional)

### Sprint 4 (Week 4) - Testing & Refinement

- [ ] Testing end-to-end
- [ ] Bug fixing
- [ ] API documentation dengan Postman/Swagger
- [ ] Deployment preparation

---

## 🧪 Testing

```bash
# Unit testing (akan ditambahkan)
npm test

# API testing dengan Postman
# Import collection dari /postman folder
```

---

## 📝 Development Tips

1. **Multer Setup**: Simpan file di `public/uploads/` agar bisa diakses Next.js frontend
2. **JWT Token**: Sertakan `role` di dalam payload JWT untuk role-based access
3. **Status Flow**: `pending` → `proses` → `selesai` (one-way flow)
4. **Query Optimization**: Filter complaints berdasarkan `user_id` untuk user biasa
5. **Error Handling**: Gunakan try-catch dan response helper yang konsisten

---

## 🚧 Roadmap Future Features

- [ ] Dashboard statistik untuk admin
- [ ] Email notification
- [ ] Export laporan ke PDF
- [ ] Kategori laporan
- [ ] Priority level (urgent, normal, low)
- [ ] Real-time notification dengan Socket.io
- [ ] Mobile app integration

---

## 👥 Contributors

- **Developer**: [Your Name]
- **Role**: Full Stack Developer

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Contact

Untuk pertanyaan atau saran, silakan hubungi:

- Email: [your-email@example.com]
- GitHub: [your-github-username]

---

**Happy Coding! 🚀**

> _"Membangun sistem yang lebih baik untuk warga yang lebih sejahtera"_
