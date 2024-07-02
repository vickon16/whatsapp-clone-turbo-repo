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

    // group users by their initial letters e.g {U : [{name : User1}]}
    const groupedByFirstLetter = users.reduce((acc: any, obj) => {
      const firstLetter = obj?.name?.charAt(0).toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(obj);
      return acc;
    }, {});

    return res.status(200).json({
      msg: "Successful",
      success: true,
      data: groupedByFirstLetter,
    });
  } catch (error) {
    next(error);
  }
};
