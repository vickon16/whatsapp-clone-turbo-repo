import { db } from "@repo/db";
import { messageSchema } from "@repo/schemas";
import { TMessageSchema } from "@repo/schemas/types";
import { NextFunction, Request, Response } from "express";
import { renameSync } from "fs";

const addMessage = async (message: TMessageSchema) => {
  const { receiverId, senderId } = message;

  // create a pair
  const senderReceiverPair = `${senderId}-@-${receiverId}`;
  const receiverSenderPair = `${receiverId}-@-${senderId}`;

  const senderReceiverData = await db.user_pair.findUnique({
    where: { id: senderReceiverPair },
  });
  const receiverSenderData = await db.user_pair.findUnique({
    where: { id: receiverSenderPair },
  });

  // find the pair in the database
  return await db.$transaction([
    // senderReceiver
    db.user_pair.upsert({
      where: { id: senderReceiverPair },
      update: {
        messages: JSON.stringify([
          ...(!!senderReceiverData?.messages
            ? JSON.parse(senderReceiverData.messages)
            : []),
          message,
        ]),
      },
      create: {
        id: senderReceiverPair,
        messages: JSON.stringify([message]),
      },
    }),
    // receiverSender
    db.user_pair.upsert({
      where: { id: receiverSenderPair },
      update: {
        messages: JSON.stringify([
          ...(!!receiverSenderData?.messages
            ? JSON.parse(receiverSenderData.messages)
            : []),
          message,
        ]),
      },
      create: {
        id: receiverSenderPair,
        messages: JSON.stringify([message]),
      },
    }),
  ]);
};

export const addPairMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validator = messageSchema.safeParse(req.body);
    if (!validator.success) {
      return res.status(400).json({
        msg: "Invalid inputs",
        success: false,
      });
    }

    const { senderId, receiverId, message } = validator.data;

    const onlineUser = onlineUsers.get(receiverId);

    const newMessage: TMessageSchema = {
      pairId: validator.data.pairId,
      id: validator.data.id,
      message,
      receiverId,
      senderId,
      type: validator.data.type,
      createdAt: new Date(Date.now()),
      messageStatus: !!onlineUser ? "delivered" : "sent",
    };

    await addMessage(newMessage);

    return res.status(200).json({
      msg: "Messages Added successfully",
      success: true,
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const setReadMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { senderId, receiverId } = req.query;

    if (
      !senderId ||
      typeof senderId !== "string" ||
      !receiverId ||
      typeof receiverId !== "string"
    ) {
      return res.status(403).json({
        msg: "Forbidden Request",
        success: false,
      });
    }

    // create a pair
    const senderReceiverPair = `${senderId}-@-${receiverId}`;
    const receiverSenderPair = `${receiverId}-@-${senderId}`;

    // find the pair in the database
    const senderReceiverData = await db.user_pair.findUnique({
      where: { id: senderReceiverPair },
    });

    // pick on of the pairs, and edit it
    const senderMessages = !!senderReceiverData?.messages
      ? (JSON.parse(senderReceiverData.messages) as TMessageSchema[])
      : [];
    const sortedSenderMessages = senderMessages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const updatedSenderMessages = JSON.stringify(
      sortedSenderMessages.map((message) => {
        // if the message is not read by the viewing user, and the senderId is the other user
        if (
          message.messageStatus !== "read" &&
          message.senderId === receiverId
        ) {
          return { ...message, messageStatus: "read" };
        }
        return message;
      })
    );

    await db.$transaction([
      // senderReceiver
      db.user_pair.upsert({
        where: { id: senderReceiverPair },
        update: {
          messages: updatedSenderMessages,
        },
        create: {
          id: senderReceiverPair,
          messages: JSON.stringify([]),
        },
      }),
      // receiverSender
      db.user_pair.upsert({
        where: { id: receiverSenderPair },
        update: {
          messages: updatedSenderMessages,
        },
        create: {
          id: receiverSenderPair,
          messages: JSON.stringify([]),
        },
      }),
    ]);

    return res.status(200).json({
      msg: "Messages Gotten successfully",
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUserPairs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  if (!userId || typeof userId !== "string") {
    return res.status(403).json({
      msg: "Forbidden Request",
      success: false,
    });
  }

  try {
    const userPairs = await db.user_pair.findMany({
      where: {
        id: { startsWith: userId },
      },
    });

    const sortedUserPairs = userPairs.map((pairMessage) => {
      const pairMessages = JSON.parse(pairMessage.messages) as TMessageSchema[];
      const sortedMessages = pairMessages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      // remove the messages from the pair
      return {
        ...pairMessage,
        messages: sortedMessages,
      };
    });

    return res.status(200).json({
      msg: "User Pairs Gotten successfully",
      success: true,
      data: sortedUserPairs,
    });
  } catch (error) {
    next(error);
  }
};

export const addImageAudioMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(404).json({
        msg: "Media not found",
        success: false,
      });
    }
    const type = req.file.fieldname as TMessageSchema["type"];

    const date = Date.now();
    let fileName =
      `uploads/${type === "image" ? "images" : type === "audio" ? "audios" : "medias"}/` +
      date +
      "-" +
      req.file.originalname;
    renameSync(req.file.path, fileName);

    const validator = messageSchema.safeParse(req.body);
    if (!validator.success) {
      return res.status(400).json({
        msg: validator.error.flatten().fieldErrors,
        success: false,
      });
    }

    const { senderId, receiverId } = validator.data;

    const onlineUser = onlineUsers.get(receiverId);

    const newMessage: TMessageSchema = {
      id: validator.data.id,
      senderId,
      receiverId,
      message: fileName,
      type,
      createdAt: new Date(validator.data.createdAt),
      pairId: validator.data.pairId,
      messageStatus: !!onlineUser ? "delivered" : "sent",
    };

    await addMessage(newMessage);

    return res.status(201).json({
      msg: "Messages Added successfully",
      success: true,
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};
