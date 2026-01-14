import { prisma } from "../../config/database.js";

/**
 * Service untuk membuat komentar baru pada complaint
 * @param {Object} data - Data komentar (complaintId, message)
 * @param {Number} userId - ID user yang membuat komentar
 * @returns {Object} - Komentar yang berhasil dibuat
 */
export const createComment = async ({ complaintId, message }, userId) => {
  // Cek apakah complaint exists
  const complaint = await prisma.complaint.findUnique({
    where: { id: parseInt(complaintId) },
  });

  if (!complaint) {
    throw new Error("Complaint tidak ditemukan");
  }

  // Buat komentar baru
  const comment = await prisma.comment.create({
    data: {
      complaintId: parseInt(complaintId),
      userId: parseInt(userId),
      message,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      complaint: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return comment;
};

/**
 * Service untuk update komentar
 * @param {Number} commentId - ID komentar yang akan diupdate
 * @param {Object} data - Data komentar baru (message)
 * @param {Number} userId - ID user yang melakukan update
 * @param {String} userRole - Role user (USER/ADMIN)
 * @returns {Object} - Komentar yang telah diupdate
 */
export const updateComment = async (
  commentId,
  { message },
  userId,
  userRole
) => {
  // Cek apakah komentar exists
  const existingComment = await prisma.comment.findUnique({
    where: { id: parseInt(commentId) },
  });

  if (!existingComment) {
    throw new Error("Komentar tidak ditemukan");
  }

  // Cek authorization: hanya pemilik yang bisa update
  if (existingComment.userId !== parseInt(userId)) {
    throw new Error(
      "Akses ditolak. Anda hanya dapat mengedit komentar Anda sendiri"
    );
  }

  // Update komentar
  const updatedComment = await prisma.comment.update({
    where: { id: parseInt(commentId) },
    data: {
      message,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      complaint: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return updatedComment;
};

/**
 * Service untuk menghapus komentar
 * @param {Number} commentId - ID komentar yang akan dihapus
 * @param {Number} userId - ID user yang melakukan penghapusan
 * @param {String} userRole - Role user (USER/ADMIN)
 * @returns {Object} - Message konfirmasi penghapusan
 */
export const deleteComment = async (commentId, userId, userRole) => {
  // Cek apakah komentar exists
  const existingComment = await prisma.comment.findUnique({
    where: { id: parseInt(commentId) },
  });

  if (!existingComment) {
    throw new Error("Komentar tidak ditemukan");
  }

  // Cek authorization: hanya pemilik atau admin yang bisa hapus
  if (existingComment.userId !== parseInt(userId) && userRole !== "ADMIN") {
    throw new Error(
      "Akses ditolak. Anda hanya dapat menghapus komentar Anda sendiri"
    );
  }

  // Hapus komentar
  await prisma.comment.delete({
    where: { id: parseInt(commentId) },
  });

  return {
    message: "Komentar berhasil dihapus",
  };
};
