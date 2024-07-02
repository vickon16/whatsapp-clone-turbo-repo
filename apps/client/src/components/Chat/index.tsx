import React from "react";
import ChatHeader from "@/components/Chat/ChatHeader";
import ChatContainer from "@/components/Chat/ChatContainer";
import MessageBar from "@/components/Chat/MessageBar";
import { useGetPairMessagesQuery } from "@/tanstack-hooks/message/queries";
import { useStateProvider } from "@/context/StateContext";
import { BiLoaderAlt } from "react-icons/bi";

function Chat() {
  const {
    state: { userInfo, currentChatUser },
  } = useStateProvider();
  const { isLoading, isFetching, error, isError } = useGetPairMessagesQuery({
    senderId: userInfo?.id,
    receiverId: currentChatUser?.id,
  });

  return (
    <aside className="z-[10] flex h-screen w-full flex-col bg-primary/70">
      <ChatHeader />
      {isLoading || isFetching ? (
        <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-y-1">
          <BiLoaderAlt className="size-10 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading Chats...</p>
        </div>
      ) : !!error || isError ? (
        <div className="justify- flex h-full w-full flex-1 flex-col items-center gap-y-1">
          <h2 className="text-clampMd font-bold text-destructive">Sorry!!!</h2>
          <p className="text-destructive">An Error Has Occurred</p>
        </div>
      ) : (
        <ChatContainer />
      )}
      <MessageBar />
    </aside>
  );
}

export default Chat;
