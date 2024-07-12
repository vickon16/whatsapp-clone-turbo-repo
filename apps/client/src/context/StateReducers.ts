import { TUserPairIncludes, TUserWithoutIsOnBoard, user } from "@repo/db";
import {
  TCallDispatchType,
  TCallSocketType,
  TCallType,
  TMessageSchema,
  type TAuthSchema,
} from "@repo/schemas/types";
import { Socket } from "socket.io-client";

export type TPageType = "all-contacts" | "default";

export type TState = {
  userInfo?: TAuthSchema;
  currentPage: TPageType;
  currentChatUser?: TUserWithoutIsOnBoard;
  allUsers: user[];
  allOnlineUsersId: string[];
  allUserPairs: TUserPairIncludes[];
  socket?: Socket;
  messageSearch: boolean;
  call?: TCallSocketType;
};

export const initialState: TState = {
  userInfo: undefined,
  currentPage: "default",
  currentChatUser: undefined,
  allUsers: [],
  allUserPairs: [],
  socket: undefined,
  messageSearch: false,
  allOnlineUsersId: [],
  call: undefined,
};

export type TAction =
  | { type: "SET_USER_INFO"; payload?: TAuthSchema }
  | { type: "SET_CURRENT_PAGE"; payload: TPageType }
  | { type: "SET_CURRENT_CHAT_USER"; payload?: TUserWithoutIsOnBoard }
  | { type: "SET_SOCKET"; payload: Socket }
  | { type: "SET_ALL_USERS"; payload: user[] }
  | { type: "SET_ALL_ONLINE_USERS_ID"; payload: string[] }
  | { type: "SET_ALL_USER_PAIRS"; payload: TUserPairIncludes[] }
  | { type: "ADD_MESSAGE_TO_USER_PAIR"; payload: TMessageSchema }
  | { type: "SET_MESSAGE_SEARCH" }

  // video and voice calls
  | { type: "SET_CALL"; payload?: TCallSocketType }
  | { type: "SET_END_CALL" }
  | { type: "LOG_OUT" };

export const reducer = (state: TState, action: TAction): TState => {
  switch (action.type) {
    case "SET_USER_INFO":
      return { ...state, userInfo: action.payload ?? undefined };
    case "SET_CURRENT_PAGE":
      {
      }
      return { ...state, currentPage: action.payload };
    case "SET_CURRENT_CHAT_USER":
      return { ...state, currentChatUser: action.payload };
    case "SET_ALL_USERS":
      return { ...state, allUsers: action.payload };
    case "SET_ALL_ONLINE_USERS_ID":
      return { ...state, allOnlineUsersId: action.payload };
    case "SET_ALL_USER_PAIRS":
      return { ...state, allUserPairs: action.payload };
    case "SET_SOCKET":
      return { ...state, socket: action.payload };
    case "ADD_MESSAGE_TO_USER_PAIR":
      return {
        ...state,
        allUserPairs: state.allUserPairs.map((pair) => {
          const senderId = action.payload.senderId;
          const receiverId = action.payload.receiverId;

          const pairId = `${senderId}-@-${receiverId}`;
          const reversePairId = `${receiverId}-@-${senderId}`;
          if (pair.id === pairId || pair.id === reversePairId) {
            return { ...pair, messages: [...pair.messages, action.payload] };
          }

          return pair;
        }),
      };
    case "SET_MESSAGE_SEARCH":
      return { ...state, messageSearch: !state.messageSearch };

    // voice and video calls
    case "SET_CALL":
      return { ...state, call: action.payload };
    case "SET_END_CALL":
      return { ...state, call: undefined };
    case "LOG_OUT":
      return initialState;
    default:
      return state;
  }
};
