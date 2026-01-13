import asyncHandler from "express-async-handler";
import { loginService } from "../../services/auth/login.service.js";
import { successResponse } from "../../utils/apiResponse.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const data = await loginService(email, password);

  return successResponse(res, "Login berhasil", data);
});
