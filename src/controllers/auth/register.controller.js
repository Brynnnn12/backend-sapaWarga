import asyncHandler from "express-async-handler";
import { registerService } from "../../services/auth/register.service.js";
import { successResponse } from "../../utils/apiResponse.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await registerService(name, email, password);

  return successResponse(res, "Registrasi berhasil", user);
});
