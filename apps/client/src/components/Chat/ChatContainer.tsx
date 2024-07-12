import { useStateProvider } from "@/context/StateContext";
import { useSetReadMessage } from "@/tanstack-hooks/message/queries";
import { cn } from "@/utils";
import { calculateTime } from "@/utils/CalculateTime";
import { useMemo } from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import VoiceMessage from "./VoiceMessage";
import TextMessage from "./TextMessage";

function ChatContainer() {
  const {
    state: { userInfo, currentChatUser, allUserPairs },
  } = useStateProvider();

  const currentMessage = useMemo(() => {
    if (!userInfo?.id || !currentChatUser?.id) return [];
    const currentUserPair = allUserPairs?.find(
      (userPair) =>
        userPair.id.startsWith(userInfo?.id) &&
        userPair.id.endsWith(currentChatUser?.id),
    );

    if (!currentUserPair) return [];
    return currentUserPair.messages;
  }, [allUserPairs, userInfo, currentChatUser]);

  const senderId = userInfo?.id;
  const receiverId = currentChatUser?.id;

  useSetReadMessage({ senderId, receiverId });

  return (
    <section className="custom-scrollbar relative h-full w-full flex-auto overflow-y-auto p-4">
      <div className="fixed inset-0 z-0 h-full w-full bg-chat-background bg-fixed opacity-5" />
      <div className=" relative mx-auto my-10 flex w-full max-w-[1200px] flex-col justify-end gap-2 overflow-y-auto">
        {currentMessage.map((message) => (
          <aside
            key={message.id}
            className={cn(`flex w-full items-center gap-2`, {
              "justify-start": message.senderId === currentChatUser?.id,
              "justify-end": message.senderId !== currentChatUser?.id,
            })}
          >
            {message.type === "text" && <TextMessage message={message} />}
            {message.type === "image" && <ImageMessage message={message} />}
            {message.type === "audio" && <VoiceMessage message={message} />}
          </aside>
        ))}
      </div>
    </section>
  );
}

export default ChatContainer;
