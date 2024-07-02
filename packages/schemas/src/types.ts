import * as z from "zod";
import { authSchema, messageSchema } from ".";

export type TAuthSchema = z.infer<typeof authSchema>;
export type TMessageSchema = z.infer<typeof messageSchema>;
