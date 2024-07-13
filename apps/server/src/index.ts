import express from "express";
import cors from "cors";
import logger from "morgan";
import dotenv from "dotenv";
import authRoutes from "@/routes/AuthRoutes.js";
import messagesRoutes from "@/routes/MessagesRoutes";
import usersRoutes from "@/routes/UsersRoutes.js";
import { Server } from "socket.io";
import { socketVariables } from "@repo/constants";
import { TCallSocketType, TMessageSchema } from "@repo/schemas/types";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(
  // logger(":method :url :status :res[content-length] - :response-time ms")
  logger("dev")
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// error handler
app.use((err: any, req: any, res: any, next: any) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/messages", messagesRoutes);

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

global.onlineUsers = new Map<string, any>(); // ensures the entries are not repeated.
// how the map would look. eg new Map([
//  ["foo", "bar"]
// ])

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "",
  },
});

io.on("connection", (socket) => {
  global.chatSocket = socket;

  // on add user
  socket.on(socketVariables.addUser, (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit(
      socketVariables.onlineUsers,
      Array.from(onlineUsers.keys())
    );
  });

  // on sign-out
  socket.on(socketVariables.signOutUser, (userId: string) => {
    onlineUsers.delete(userId),
      socket.broadcast.emit(
        socketVariables.onlineUsers,
        Array.from(onlineUsers.keys())
      );
  });

  // on send messages
  socket.on(socketVariables.sendMessage, (data: TMessageSchema) => {
    // get the receiver user
    const sendUserSocketId = onlineUsers.get(data.receiverId);
    // if the user is online, tell the other user that the current user have received the message.
    if (!!sendUserSocketId) {
      console.log("user is online");
      socket.to(sendUserSocketId).emit(socketVariables.receiveMessage, data);
    }
  });

  // on out-going call
  socket.on(socketVariables.outGoingCall, (data: TCallSocketType) => {
    const sendUserSocketId = onlineUsers.get(data.receiver.id);
    if (!!sendUserSocketId) {
      socket.to(sendUserSocketId).emit(socketVariables.incomingCall, {
        ...data,
        dispatchType: "in-coming",
      } satisfies TCallSocketType);
    }
  });

  // on accept incoming voice and video call
  socket.on(socketVariables.acceptIncomingCall, (data: TCallSocketType) => {
    const sendUserSocketId = onlineUsers.get(data.receiver.id);
    if (!!sendUserSocketId) {
      socket
        .to(sendUserSocketId)
        .emit(socketVariables.acceptIncomingCallApprove, data);
    }
  });

  // on reject call
  socket.on(socketVariables.rejectCall, (id: string) => {
    const sendUserSocketId = onlineUsers.get(id);
    if (!!sendUserSocketId) {
      socket.to(sendUserSocketId).emit(socketVariables.rejectCallApproved);
    }
  });
});
