import { prisma } from "../../config/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllComplaints = async (req) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const [complaints, total] = await Promise.all([
    prisma.complaint.findMany({
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.complaint.count(),
  ]);

  return { complaints, total, page: parseInt(page), limit: parseInt(limit) };
};

export const createComplaint = async ({ title, description }, userId, file) => {
  let imagePath = null;

  if (file) {
    imagePath = `/uploads/${file.filename}`;
  }

  const complaintData = {
    title,
    description,
    userId: parseInt(userId),
    ...(imagePath && { image: imagePath }),
  };

  const complaint = await prisma.complaint.create({
    data: complaintData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return complaint;
};

export const updateComplaint = async (
  id,
  { title, description },
  userId,
  userRole,
  file
) => {
  const existingComplaint = await prisma.complaint.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingComplaint) {
    throw new Error("Pengaduan tidak ditemukan");
  }

  // Cek otorisasi
  if (existingComplaint.userId !== userId && userRole !== "ADMIN") {
    throw new Error("Anda tidak memiliki izin untuk mengupdate pengaduan ini");
  }

  let updateData = { title, description };
  let oldImagePath = null;
  let newImagePath = null;

  // Handle upload gambar baru
  if (file) {
    updateData.image = `/uploads/${file.filename}`;
    newImagePath = file.path;

    // Simpan path gambar lama untuk dihapus
    if (existingComplaint.image) {
      oldImagePath = path.join(
        __dirname,
        "../../../public",
        existingComplaint.image
      );
    }
  }

  // Update complaint
  let updatedComplaint;
  try {
    updatedComplaint = await prisma.complaint.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    // Rollback: hapus gambar baru jika update database gagal
    if (newImagePath && fs.existsSync(newImagePath)) {
      try {
        fs.unlinkSync(newImagePath);
        console.log("Rolled back new image due to update failure");
      } catch (deleteError) {
        console.error("Error deleting new image during rollback:", deleteError);
      }
    }
    throw error;
  }

  // Hapus gambar lama jika ada dan berhasil update
  if (oldImagePath && fs.existsSync(oldImagePath)) {
    try {
      fs.unlinkSync(oldImagePath);
    } catch (error) {
      console.error("Error menghapus gambar lama:", error);
      // Tidak throw error karena update sudah berhasil
    }
  }

  return updatedComplaint;
};

export const deleteComplaint = async (id, userId, userRole) => {
  const complaint = await prisma.complaint.findUnique({
    where: { id: parseInt(id) },
  });

  if (!complaint) {
    throw new Error("Pengaduan tidak ditemukan");
  }

  if (complaint.userId !== userId && userRole !== "ADMIN") {
    throw new Error("Anda tidak memiliki izin untuk menghapus pengaduan ini");
  }

  // Simpan path gambar untuk dihapus
  let imagePath = null;
  if (complaint.image) {
    imagePath = path.join(__dirname, "../../../public", complaint.image);
  }

  // Hapus complaint dari database
  await prisma.complaint.delete({
    where: { id: parseInt(id) },
  });

  // Hapus gambar dari filesystem jika ada
  if (imagePath && fs.existsSync(imagePath)) {
    try {
      fs.unlinkSync(imagePath);
    } catch (error) {
      console.error("Error menghapus gambar:", error);
    }
  }

  return { message: "Pengaduan berhasil dihapus" };
};

export const updateComplaintStatus = async (id, { status }, userRole) => {
  if (userRole !== "ADMIN") {
    throw new Error("Hanya admin yang dapat mengupdate status pengaduan");
  }

  const complaint = await prisma.complaint.findUnique({
    where: { id: parseInt(id) },
  });

  if (!complaint) {
    throw new Error("Pengaduan tidak ditemukan");
  }

  const validStatuses = ["PENDING", "PROSES", "SELESAI"];
  if (!validStatuses.includes(status)) {
    throw new Error(
      "Status tidak valid. Status harus PENDING, PROSES, atau SELESAI"
    );
  }

  const updatedComplaint = await prisma.complaint.update({
    where: { id: parseInt(id) },
    data: {
      status: status,
      updatedAt: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedComplaint;
};
