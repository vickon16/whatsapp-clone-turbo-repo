import { generateToken04 } from "@/utils/TokenGenerator.js";
import { db } from "@repo/db";
import { authSchema } from "@repo/schemas";
import { NextFunction, Request, Response } from "express";

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validator = authSchema
    .pick({ email: true, id: true })
    .safeParse(req.body);
  if (!validator.success) {
    return res.status(403).json({
      msg: "Invalid Credentials",
      success: false,
    });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: validator.data.id, email: validator.data.email },
    });

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      msg: "Successful",
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const onboardUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validator = authSchema.safeParse(req.body);
  if (!validator.success) {
    return res.status(403).json({
      msg: "Invalid Credentials",
      success: false,
    });
  }

  try {
    const user = await db.user.create({
      data: {
        ...validator.data,
        isOnBoard: true,
      },
    });

    return res.status(200).json({
      msg: "Successful",
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const generateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appId = parseInt(process.env.ZEGO_APP_ID || "");
    const serverSecret = process.env.ZEGO_SERVER_SECRET || "";

    const userId = req.params.userId;
    const effectiveTime = 3600;

    if (!appId || !serverSecret || !userId)
      return res.status(403).json({
        msg: "Forbidden Request ",
        success: false,
      });

    const token = generateToken04(appId, userId, serverSecret, effectiveTime);

    return res.status(200).json({
      msg: "Successful",
      success: true,
      data: token,
    });
  } catch (error) {
    next(error);
  }
};
