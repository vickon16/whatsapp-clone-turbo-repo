import * as z from "zod";
import { authSchema, messageSchema } from ".";

export type TAuthSchema = z.infer<typeof authSchema>;
export type TMessageSchema = z.infer<typeof messageSchema>;

export type TCallType = "voice" | "video";
export type TCallDispatchType = "out-going" | "in-coming" | "in-call";

export type TCallSocketType = {
  dispatchType: TCallDispatchType;
  sender: TAuthSchema;
  receiver: TAuthSchema;
  callType: TCallType;
  roomId: number;
};
