import React from "react";
import ChatList from "@/components/ChatList";
import Empty from "@/components/common/Empty";
import Chat from "@/components/Chat";
import { useStateProvider } from "@/context/StateContext";

function Main() {
  const {
    state: { currentChatUser },
  } = useStateProvider();

  return (
    <section className="grid h-screen max-h-screen w-screen max-w-full grid-cols-[auto,1fr] overflow-hidden">
      <ChatList />
      {!!currentChatUser ? <Chat /> : <Empty />}
    </section>
  );
}

export default Main;
