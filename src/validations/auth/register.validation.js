import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Nama harus diisi" })
    .min(2, "Nama minimal 2 karakter"),
  email: z
    .string({ required_error: "Email harus diisi" })
    .email("Format email tidak valid"),
  password: z
    .string({ required_error: "Password harus diisi" })
    .min(6, "Password minimal 6 karakter"),
});
