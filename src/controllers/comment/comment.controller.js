import asyncHandler from "express-async-handler";
import {
  createComment,
  updateComment,
  deleteComment,
} from "../../services/comment/comment.service.js";
import { successResponse } from "../../utils/apiResponse.js";

/**
 * Controller untuk membuat komentar baru
 * POST /api/comments
 */
export const createNewComment = asyncHandler(async (req, res) => {
  const data = await createComment(req.body, req.user.id);
  return successResponse(res, "Komentar berhasil dibuat", data, null, 201);
});

/**
 * Controller untuk update komentar
 * PUT /api/comments/:id
 */
export const updateCommentById = asyncHandler(async (req, res) => {
  const data = await updateComment(
    req.params.id,
    req.body,
    req.user.id,
    req.user.role
  );
  return successResponse(res, "Komentar berhasil diupdate", data);
});

/**
 * Controller untuk menghapus komentar
 * DELETE /api/comments/:id
 */
export const deleteCommentById = asyncHandler(async (req, res) => {
  const data = await deleteComment(req.params.id, req.user.id, req.user.role);
  return successResponse(res, data.message);
});
