import asyncHandler from "express-async-handler";
import {
  getAllComplaints,
  createComplaint,
  updateComplaint,
  deleteComplaint,
  updateComplaintStatus,
} from "../../services/complaint/complaint.service.js";
import {
  successResponse,
  paginatedResponse,
  errorResponse,
} from "../../utils/apiResponse.js";

export const getComplaints = asyncHandler(async (req, res) => {
  const result = await getAllComplaints(req);

  const pagination = {
    page: result.page,
    limit: result.limit,
    total: result.total,
  };

  return paginatedResponse(
    res,
    "Pengaduan berhasil diambil",
    result.complaints,
    pagination
  );
});

export const createNewComplaint = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return errorResponse(res, "Authentication diperlukan", 401);
  }

  console.log("req.file after multer:", req.file);
  const data = await createComplaint(req.body, req.user.id, req.file);
  return successResponse(res, "Pengaduan berhasil dibuat", data, null, 201);
});

export const updateComplaintById = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return errorResponse(res, "Authentication diperlukan", 401);
  }

  const data = await updateComplaint(
    req.params.id,
    req.body,
    req.user.id,
    req.user.role,
    req.file
  );
  return successResponse(res, "Pengaduan berhasil diupdate", data);
});

export const deleteComplaintById = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return errorResponse(res, "Authentication diperlukan", 401);
  }

  const data = await deleteComplaint(req.params.id, req.user.id, req.user.role);
  return successResponse(res, data.message);
});

export const updateComplaintStatusById = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.role) {
    return errorResponse(res, "Authentication diperlukan", 401);
  }

  const data = await updateComplaintStatus(
    req.params.id,
    req.body,
    req.user.role
  );
  return successResponse(res, "Status pengaduan berhasil diupdate", data);
});
