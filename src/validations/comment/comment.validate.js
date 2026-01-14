import z from "zod";

export const commentSchema = z.object({
  complaintId: z
    .string()
    .uuid({ message: "complaintId harus berupa UUID yang valid" }),
  message: z
    .string()
    .min(1, { message: "message tidak boleh kosong" })
    .max(1000, { message: "message maksimal 1000 karakter" }),
});

export const commentUpdateSchema = z.object({
  message: z
    .string()
    .min(1, { message: "message tidak boleh kosong" })
    .max(1000, { message: "message maksimal 1000 karakter" }),
});
