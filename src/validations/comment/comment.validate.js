import z from "zod";

export const commentSchema = z.object({
  complaintId: z
    .number()
    .int()
    .positive({ message: "Complaint ID harus berupa angka positif" })
    .or(
      z.string().regex(/^\d+$/, { message: "Complaint ID harus berupa angka" })
    )
    .transform((val) => (typeof val === "string" ? parseInt(val) : val)),
  message: z
    .string()
    .min(1, { message: "Message tidak boleh kosong" })
    .max(1000, { message: "Message maksimal 1000 karakter" }),
});

export const commentUpdateSchema = z.object({
  message: z
    .string()
    .min(1, { message: "message tidak boleh kosong" })
    .max(1000, { message: "message maksimal 1000 karakter" }),
});
