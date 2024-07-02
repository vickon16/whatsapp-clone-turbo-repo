import { Input } from "@/components/ui/input";
import { useStateProvider } from "@/context/StateContext";
import { useAddMessageMutation } from "@/tanstack-hooks/message/mutation";
import { iconStyle } from "@/utils/constants";
import { socketVariables } from "@repo/constants";
import { TMessageSchema } from "@repo/schemas/types";
import { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";

function MessageBar() {
  const {
    state: { userInfo, currentChatUser, socket },
    dispatch,
  } = useStateProvider();
  const [message, setMessage] = useState("");
  const mutation = useAddMessageMutation();

  const sendMessage = async () => {
    if (!message || !userInfo || !currentChatUser) return;

    const messageParams: TMessageSchema = {
      senderId: userInfo.id,
      receiverId: currentChatUser.id,
      message,
      type: "text",
      createdAt: new Date(Date.now()),
      pairId: `${userInfo.id}-@-${currentChatUser.id}`,
    };

    dispatch({ type: "ADD_TO_PAIR_MESSAGES", payload: messageParams });

    mutation.mutate(messageParams, {
      onSuccess: () => {
        socket?.emit(socketVariables.sendMessage, messageParams);
        setMessage("");
      },
    });
  };

  return (
    <section className="relative flex h-20 items-center gap-4 bg-background px-4">
      <div className="flex gap-6">
        <BsEmojiSmile className={iconStyle} title="Emoji" />
        <ImAttachment className={iconStyle} title="Attach File" />
      </div>

      <Input
        name=""
        type="text"
        placeholder="Type a message..."
        className="border-none bg-input text-sm text-white"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
          }
        }}
      />

      <div className="flex gap-6">
        <button onClick={sendMessage}>
          <MdSend className={iconStyle} title="Send Message" />
        </button>
        <button>
          <FaMicrophone className={iconStyle} title="Record" />
        </button>
      </div>
    </section>
  );
}

export default MessageBar;
