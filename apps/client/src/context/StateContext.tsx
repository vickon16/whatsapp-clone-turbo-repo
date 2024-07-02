import { API } from "@/utils";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { appLinks } from "@/utils/appLinks";
import { defaultAvatar } from "@/utils/constants";
import { socketVariables } from "@repo/constants";
import { TAuthSchema, TMessageSchema } from "@repo/schemas/types";
import { AxiosError } from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type Dispatch,
  type PropsWithChildren
} from "react";
import { io } from "socket.io-client";
import {
  initialState,
  reducer,
  type TAction,
  type TState,
} from "./StateReducers";

// Define the context type
type TStateContext = {
  state: TState;
  dispatch: Dispatch<TAction>;
};

const StateContext = createContext<TStateContext | undefined>(undefined);

export const StateProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [socketEvent, setSocketEvent] = useState(false);

  const redirectToLogin = () => {
    dispatch({ type: "SET_USER_INFO", payload: undefined });
    return router.push(appLinks.login);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        // check user in database
        try {
          const resp = await API.post(appLinks.authCheckUserRoute, {
            email: user.email,
            id: user.uid,
          });

          if (!resp.data.data) return redirectToLogin();
          const newUser = resp.data.data as TAuthSchema;

          dispatch({
            type: "SET_USER_INFO",
            payload: {
              ...newUser,
              image: newUser.image || defaultAvatar,
            },
          });

          // for socket connection
          const socket = io(process.env.NEXT_PUBLIC_SERVER_URL || "");
          socket.emit(socketVariables.addUser, newUser.id);
          return dispatch({ type: "SET_SOCKET", payload: socket });
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
              return redirectToLogin();
            }
          }

          console.log(error);
        }
      } else {
        redirectToLogin();
      }
    });

    setIsLoading(false);
    return () => unSubscribe();
  }, []);

  // for socket connection
  useEffect(() => {
    if (!!state.socket && !socketEvent) {
      state.socket.on(
        socketVariables.receiveMessage,
        (message: TMessageSchema) => {
          dispatch({ type: "ADD_TO_PAIR_MESSAGES", payload: message });
        },
      );

      setSocketEvent(true);
    }
  }, [state.socket, socketEvent]);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {isLoading ? <div>Loading</div> : children}
    </StateContext.Provider>
  );
};

export const useStateProvider = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("State must be used within a State Context Provider");
  }

  return context;
};
