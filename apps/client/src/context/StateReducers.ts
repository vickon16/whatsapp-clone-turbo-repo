import { TUserWithoutIsOnBoard, TUserPair } from "@repo/db";
import { TMessageSchema, type TAuthSchema } from "@repo/schemas/types";
import { Socket } from "socket.io-client";

export type TPageType = "all-contacts" | "default";

export type TState = {
  userInfo?: TAuthSchema;
  currentPage: TPageType;
  currentChatUser?: TUserWithoutIsOnBoard;
  messages: TMessageSchema[];
  socket?: Socket;
};

export const initialState: TState = {
  userInfo: undefined,
  currentPage: "default",
  currentChatUser: undefined,
  messages: [],
  socket: undefined,
};

export type TAction =
  | { type: "SET_USER_INFO"; payload?: TAuthSchema }
  | { type: "SET_CURRENT_PAGE"; payload: TPageType }
  | { type: "SET_CURRENT_CHAT_USER"; payload: TUserWithoutIsOnBoard }
  | { type: "SET_PAIR_MESSAGES"; payload: TMessageSchema[] }
  | { type: "ADD_TO_PAIR_MESSAGES"; payload: TMessageSchema }
  | { type: "SET_SOCKET"; payload: Socket };

export const reducer = (state: TState, action: TAction): TState => {
  switch (action.type) {
    case "SET_USER_INFO":
      return { ...state, userInfo: action.payload ?? undefined };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_CURRENT_CHAT_USER":
      return { ...state, currentChatUser: action.payload };
    case "SET_PAIR_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_SOCKET":
      return { ...state, socket: action.payload };
    case "ADD_TO_PAIR_MESSAGES": {
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    }
    default:
      return state;
  }
};
