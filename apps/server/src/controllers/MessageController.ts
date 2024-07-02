import { db } from "@repo/db";
import { messageSchema } from "@repo/schemas";
import { TMessageSchema } from "@repo/schemas/types";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

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

    const { senderId, receiverId, message, type, pairId } = validator.data;

    if (!message || !senderId || !receiverId) {
      return res.status(403).json({
        msg: "Forbidden Request",
        success: false,
      });
    }

    const onlineUser = onlineUsers.get(receiverId);

    const newMessage: TMessageSchema = {
      pairId,
      id: uuidv4(),
      message,
      receiverId,
      senderId,
      type,
      createdAt: new Date(Date.now()),
      messageStatus: !!onlineUser ? "delivered" : "sent",
    };

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
    const newMessages = await db.$transaction([
      // senderReceiver
      db.user_pair.upsert({
        where: { id: senderReceiverPair },
        update: {
          messages: JSON.stringify([
            ...(!!senderReceiverData?.messages
              ? JSON.parse(senderReceiverData.messages)
              : []),
            newMessage,
          ]),
        },
        create: {
          id: senderReceiverPair,
          messages: JSON.stringify([newMessage]),
          senderId,
          receiverId,
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
            newMessage,
          ]),
        },
        create: {
          id: receiverSenderPair,
          messages: JSON.stringify([newMessage]),
          senderId,
          receiverId,
        },
      }),
    ]);

    return res.status(200).json({
      msg: "Messages Added successfully",
      success: true,
      data: newMessages[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getPairMessages = async (
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
        if (message.messageStatus !== "read" && message.senderId !== senderId) {
          return { ...message, messageStatus: "read" };
        }
        return message;
      })
    );

    const newMessages = await db.$transaction([
      // senderReceiver
      db.user_pair.upsert({
        where: { id: senderReceiverPair },
        update: {
          messages: updatedSenderMessages,
        },
        create: {
          id: senderReceiverPair,
          messages: JSON.stringify([]),
          senderId,
          receiverId,
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
          senderId,
          receiverId,
        },
      }),
    ]);

    return res.status(200).json({
      msg: "Messages Gotten successfully",
      success: true,
      data: {
        ...newMessages[0],
        messages: JSON.parse(newMessages[0].messages),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getChatListMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { senderId } = req.params;

  if (!senderId || typeof senderId !== "string") {
    return res.status(403).json({
      msg: "Forbidden Request",
      success: false,
    });
  }

  try {
    const pairMessages = await db.user_pair.findMany({
      where: {
        id: { startsWith: senderId },
      },
      include: { sender: true, receiver: true },
    });

    const sortedPairMessages = pairMessages.map((pairMessage) => {
      const messages = JSON.parse(pairMessage.messages) as TMessageSchema[];
      const sortedMessages = messages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      return {
        ...pairMessage,
        messages: undefined,
        unreadMessagesLength: sortedMessages.filter(
          (message) => message.messageStatus !== "read"
        ).length,
        lastMessage: sortedMessages.slice(-1) || [],
      };
    });

    return res.status(200).json({
      msg: "Messages Gotten successfully",
      success: true,
      data: sortedPairMessages,
    });
  } catch (error) {
    next(error);
  }
};
