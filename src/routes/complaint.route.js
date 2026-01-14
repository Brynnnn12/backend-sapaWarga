import express from "express";
import {
  getComplaints,
  createNewComplaint,
  updateComplaintById,
  deleteComplaintById,
  updateComplaintStatusById,
} from "../controllers/complaint/complaint.controller.js";
import { isLogin, isAdmin } from "../middewares/auth.middleware.js";
import { upload } from "../middewares/upload.middleware.js";
import { validate } from "../middewares/validate.middleware.js";
import {
  complaintSchema,
  complaintUpdateSchema,
  complaintStatusSchema,
} from "../validations/complaint/complaint.validate.js";

const router = express.Router();

// GET /api/complaints - Get all complaints with pagination
router.get("/", getComplaints);

// POST /api/complaints - Create new complaint (requires login and optional image upload)
router.post(
  "/",
  isLogin,
  upload.single("image"),
  validate(complaintSchema),
  createNewComplaint
);

// PUT /api/complaints/:id - Update complaint (requires login, owner or admin, optional image upload)
router.put(
  "/:id",
  isLogin,
  upload.single("image"),
  validate(complaintUpdateSchema),
  updateComplaintById
);

// DELETE /api/complaints/:id - Delete complaint (requires login, owner or admin)
router.delete("/:id", isLogin, deleteComplaintById);

// PATCH /api/complaints/:id/status - Update complaint status (requires admin)
router.patch(
  "/:id/status",
  isLogin,
  isAdmin,
  validate(complaintStatusSchema),
  updateComplaintStatusById
);

export default router;
