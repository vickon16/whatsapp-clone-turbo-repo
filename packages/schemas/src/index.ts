import * as z from "zod";

export const authSchema = z.object({
  id: z.string().min(10),
  email: z.string().email().trim(),
  name: z.string().min(2),
  image: z.string().url().or(z.literal("")),
  bio: z.string().optional(),
  isOnBoard: z.boolean().optional(),
});

export const messageSchema = z.object({
  pairId: z.string().refine((value) => {
    return value.includes("-@-");
  }),
  id: z.string().min(10),
  type: z.union([z.literal("text"), z.literal("audio"), z.literal("image")]),
  message: z.string().min(1),
  senderId: z.string().min(10),
  receiverId: z.string().min(10),
  messageStatus: z
    .union([z.literal("read"), z.literal("delivered"), z.literal("sent")])
    .optional(),
  createdAt: z.coerce.date(),
});
