import express from "express";
import {
  createNewComment,
  updateCommentById,
  deleteCommentById,
} from "../controllers/comment/comment.controller.js";
import { isLogin } from "../middewares/auth.middleware.js";
import { validate } from "../middewares/validate.middleware.js";
import {
  commentSchema,
  commentUpdateSchema,
} from "../validations/comment/comment.validate.js";

const router = express.Router();

// POST /api/comments - Create new comment (requires login)
router.post("/", isLogin, validate(commentSchema), createNewComment);

// PUT /api/comments/:id - Update comment (requires login, only owner)
router.put("/:id", isLogin, validate(commentUpdateSchema), updateCommentById);

// DELETE /api/comments/:id - Delete comment (requires login, owner or admin)
router.delete("/:id", isLogin, deleteCommentById);

export default router;
