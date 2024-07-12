import { Input } from "@/components/ui/input";
import { useStateProvider } from "@/context/StateContext";
import useHandleOutsideClick from "@/hooks/useHandleOutsideClick";
import {
  useAddMessageMutation,
  useImageAudioMessageMutation,
} from "@/tanstack-hooks/message/mutation";
import { useSetReadMessage } from "@/tanstack-hooks/message/queries";
import { iconStyle } from "@/utils/constants";
import { socketVariables } from "@repo/constants";
import { TMessageSchema } from "@repo/schemas/types";
import EmojiPicker, { PickerProps } from "emoji-picker-react";
import { useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import Attachment from "@/components/ui/attachment";
import CaptureAudio from "@/components/common/CaptureAudio";

function MessageBar() {
  const {
    state: { userInfo, currentChatUser, socket },
    dispatch,
  } = useStateProvider();
  const [message, setMessage] = useState("");
  const mutation = useAddMessageMutation();
  const imageAudioMutation = useImageAudioMessageMutation();
  const { refetch } = useSetReadMessage({
    senderId: userInfo?.id,
    receiverId: currentChatUser?.id,
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState<File | null>(null);

  const sendMessage = async () => {
    if (!message || !userInfo || !currentChatUser) return;

    const messageParams: TMessageSchema = {
      id: uuidv4(),
      senderId: userInfo.id,
      receiverId: currentChatUser.id,
      message,
      type: "text",
      createdAt: new Date(Date.now()),
      pairId: `${userInfo.id}-@-${currentChatUser.id}`,
    };

    mutation.mutate(messageParams, {
      onSuccess: (data) => {
        refetch();
        dispatch({ type: "ADD_MESSAGE_TO_USER_PAIR", payload: data });
        socket?.emit(socketVariables.sendMessage, data);
        setMessage("");
      },
    });
  };

  const sendImageMessage = async (file: File | undefined) => {
    if (!file || !userInfo || !currentChatUser) return;
    const messageParams: TMessageSchema = {
      id: uuidv4(),
      senderId: userInfo.id,
      receiverId: currentChatUser.id,
      message: "nill",
      type: "image",
      createdAt: new Date(Date.now()),
      pairId: `${userInfo.id}-@-${currentChatUser.id}`,
      messageStatus: "sent",
    };

    const formData = new FormData();

    formData.append("image", file);
    Object.entries(messageParams).forEach(([key, value]) => {
      if (value instanceof Date)
        return formData.append(key, value.toISOString());
      return formData.append(key, value);
    });

    imageAudioMutation.mutate(formData, {
      onSuccess: (data) => {
        refetch();
        dispatch({ type: "ADD_MESSAGE_TO_USER_PAIR", payload: data });
        socket?.emit(socketVariables.sendMessage, data);
      },
    });
  };

  const sendAudioMessage = async () => {
    if (!renderedAudio || !userInfo || !currentChatUser) return;

    const messageParams: TMessageSchema = {
      id: uuidv4(),
      senderId: userInfo.id,
      receiverId: currentChatUser.id,
      message: "nill",
      type: "audio",
      createdAt: new Date(Date.now()),
      pairId: `${userInfo.id}-@-${currentChatUser.id}`,
      messageStatus: "sent",
    };

    const formData = new FormData();

    formData.append("audio", renderedAudio);
    Object.entries(messageParams).forEach(([key, value]) => {
      if (value instanceof Date)
        return formData.append(key, value.toISOString());
      return formData.append(key, value);
    });

    imageAudioMutation.mutate(formData, {
      onSuccess: (data) => {
        refetch();
        dispatch({ type: "ADD_MESSAGE_TO_USER_PAIR", payload: data });
        socket?.emit(socketVariables.sendMessage, data);
      },
    });
  };

  useHandleOutsideClick({
    contextIdentifier: "emoji-open",
    contextRef: emojiPickerRef,
    callBack: () => setShowEmojiPicker(false),
  });

  return (
    <section className="relative flex h-20 items-center gap-4 bg-background px-4">
      {!showAudioRecorder && (
        <>
          <div className="flex gap-6">
            <BsEmojiSmile
              className={iconStyle}
              title="Emoji"
              id="emoji-open"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            />
            {showEmojiPicker && (
              <div
                className="absolute bottom-24 left-16 z-40"
                ref={emojiPickerRef}
              >
                <EmojiPicker
                  onEmojiClick={(emoji) =>
                    setMessage((prev) => (prev += emoji.emoji))
                  }
                  theme={"dark" as PickerProps["theme"]}
                />
              </div>
            )}

            <Attachment setImageFile={sendImageMessage} />
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
            {!!message.length ? (
              <button onClick={sendMessage}>
                <MdSend className={iconStyle} title="Send Message" />
              </button>
            ) : (
              <button>
                <FaMicrophone
                  className={iconStyle}
                  onClick={() => setShowAudioRecorder(true)}
                  title="Record"
                />
              </button>
            )}
          </div>
        </>
      )}

      {showAudioRecorder && (
        <CaptureAudio
          hide={() => setShowAudioRecorder(false)}
          setRenderedAudio={setRenderedAudio}
          sendAudioMessage={sendAudioMessage}
        />
      )}
    </section>
  );
}

export default MessageBar;
