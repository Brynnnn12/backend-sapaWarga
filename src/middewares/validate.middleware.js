import { z } from "zod";
import {
  errorResponse,
  validationErrorResponse,
} from "../utils/apiResponse.js";

export const validate = (schema) => {
  return (req, res, next) => {
    // Gunakan safeParse agar tidak langsung melempar error dan lebih mudah dikontrol
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Format error dari Zod menjadi lebih rapi
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return validationErrorResponse(res, errors);
    }

    // PENTING: Ganti req.body dengan data yang sudah divalidasi (sanitized)
    // Ini akan menghapus field tambahan yang tidak ada di skema (Security: Mass Assignment Protection)
    req.body = result.data;

    next();
  };
};
