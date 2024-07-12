import ChatContainer from "@/components/Chat/ChatContainer";
import ChatHeader from "@/components/Chat/ChatHeader";
import MessageBar from "@/components/Chat/MessageBar";

function Chat() {
  return (
    <aside className="z-[10] col-span-2 flex h-screen w-full flex-col bg-primary/70">
      <ChatHeader />
      <ChatContainer />
      <MessageBar />
    </aside>
  );
}

export default Chat;
