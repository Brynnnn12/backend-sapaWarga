import z from "zod";

export const complaintSchema = z.object({
  title: z
    .string()
    .min(5, { message: "title minimal 5 karakter" })
    .max(100, { message: "title maksimal 100 karakter" }),
  description: z
    .string()
    .min(10, { message: "description minimal 10 karakter" })
    .max(2000, { message: "description maksimal 2000 karakter" }),
  image: z.string().optional(),
});

export const complaintUpdateSchema = z.object({
  title: z
    .string()
    .min(5, { message: "title minimal 5 karakter" })
    .max(100, { message: "title maksimal 100 karakter" })
    .optional(),
  description: z
    .string()
    .min(10, { message: "description minimal 10 karakter" })
    .max(2000, { message: "description maksimal 2000 karakter" })
    .optional(),
  image: z.string().optional(),
});

export const complaintStatusSchema = z.object({
  status: z.enum(["PENDING", "PROSES", "SELESAI"], {
    errorMap: () => ({ message: "Status harus PENDING, PROSES, atau SELESAI" }),
  }),
});
