import { useStateProvider } from "@/context/StateContext";
import { cn } from "@/utils";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";

function ChatContainer() {
  const {
    state: { userInfo, currentChatUser, messages },
  } = useStateProvider();

  return (
    <section className="custom-scrollbar relative h-full w-full flex-auto overflow-y-auto p-4">
      <div className="absolute inset-0 z-0 h-full w-full bg-chat-background bg-fixed opacity-5" />
      <div className="mx-auto my-10 flex w-full max-w-[1200px] flex-col justify-end gap-2 overflow-y-auto">
        {messages?.map((message) => (
          <aside
            key={message.id}
            className={cn(`flex w-full items-center gap-2`, {
              "justify-start": message.senderId === currentChatUser?.id,
              "justify-end": message.senderId !== currentChatUser?.id,
            })}
          >
            {message.type === "text" && (
              <div
                className={cn(
                  "flex max-w-[45%] flex-col rounded-md px-3 py-1 text-sm",
                  {
                    "bg-background": message.senderId === currentChatUser?.id,
                    "bg-emerald-800": message.senderId !== currentChatUser?.id,
                  },
                )}
              >
                <p className="break-all">
                  {message.message}
                  {Array.from({ length: 12 }).map(() => (
                    <span>{"\u00A0"}</span>
                  ))}
                </p>
                <p className="flex items-center gap-x-1 self-end">
                  <span className="min-w-fit whitespace-nowrap text-[10px] text-[hsla(0,0%,100%,0.6)]">
                    {calculateTime(new Date(message.createdAt).toISOString())}
                  </span>
                  {message.senderId === userInfo?.id && (
                    <MessageStatus messageStatus={message.messageStatus} />
                  )}
                </p>
              </div>
            )}
          </aside>
        ))}
      </div>
    </section>
  );
}

export default ChatContainer;
