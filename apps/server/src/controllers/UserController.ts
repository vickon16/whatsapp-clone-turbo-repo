import { db } from "@repo/db";
import { NextFunction, Request, Response } from "express";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await db.user.findMany({
      orderBy: { name: "asc" },
      select: { id: true, email: true, name: true, image: true, bio: true },
    });

    return res.status(200).json({
      msg: "Successful",
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOnlineUsersId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json({
      msg: "Successful",
      success: true,
      data: Array.from(onlineUsers.keys()) || [],
    });
  } catch (error) {
    next(error);
  }
};
