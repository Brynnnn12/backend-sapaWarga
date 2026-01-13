import asyncHandler from "express-async-handler";
import { registerService } from "../../services/auth/register.service.js";
import { successResponse } from "../../utils/apiResponse.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerService(req.body);

  return successResponse(res, "Registrasi berhasil", user);
});
