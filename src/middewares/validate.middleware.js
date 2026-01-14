import { z } from "zod";
import fs from "fs";
import {
  errorResponse,
  validationErrorResponse,
} from "../utils/apiResponse.js";

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error?.errors || [];

        // Jika tidak ada error (edge case), lanjutkan
        if (errors.length === 0) {
          return next();
        }

        // Hapus file yang sudah diupload jika validasi gagal
        if (req.file && req.file.path) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (err) {
            console.error("Error deleting uploaded file:", err);
          }
        }

        const formattedErrors = errors.map((err) => ({
          field: err.path && err.path.length > 0 ? err.path.join(".") : "input",
          message: err.message,
        }));

        return validationErrorResponse(res, formattedErrors);
      }

      req.body = result.data;

      next();
    } catch (error) {
      console.error("Validation middleware error:", error);

      // Hapus file jika ada error
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.error("Error deleting uploaded file:", err);
        }
      }

      return errorResponse(res, "Internal validation error");
    }
  };
};
