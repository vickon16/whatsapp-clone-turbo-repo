import { Prisma, PrismaClient, user } from "@prisma/client";
import { TMessageSchema } from "@repo/schemas/types";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = db;

export * from "@prisma/client";

export type TUserWithoutIsOnBoard = Omit<user, "isOnBoard">;
export type TUserPair = Omit<Prisma.user_pairGetPayload<{}>, "messages"> & {
  messages: TMessageSchema[];
};
export type TUserPairIncludes = Omit<
  Prisma.user_pairGetPayload<{}>,
  "messages"
> & {
  messages: TMessageSchema[];
};
