import { useStateProvider } from "@/context/StateContext";
import { env } from "@/env";
import { cn } from "@/utils";
import { calculateTime } from "@/utils/CalculateTime";
import { TMessageSchema } from "@repo/schemas/types";
import Image from "next/image";
import React from "react";
import MessageStatus from "../common/MessageStatus";

type Props = {
  message: TMessageSchema;
};

function ImageMessage({ message }: Props) {
  const {
    state: { currentChatUser, userInfo },
  } = useStateProvider();

  return (
    <div
      className={cn("flex flex-col gap-y-1 rounded-lg p-1", {
        "bg-background": message.senderId === currentChatUser?.id,
        "bg-emerald-800": message.senderId !== currentChatUser?.id,
      })}
    >
      <div className="relative aspect-square h-[300px]">
        <Image
          src={`${env.NEXT_PUBLIC_SERVER_URL}/${message.message}`}
          alt="chat-image"
          fill
          className="h-full w-full rounded-lg object-cover object-center"
        />
      </div>
      <div className="flex gap-1 self-end">
        <span className="min-w-fit whitespace-nowrap text-[10px] text-link">
          {calculateTime(new Date(message.createdAt).toISOString())}
        </span>
        <span className="text-[hsla(0,0%,100%,0.6)]">
          {message.senderId === userInfo?.id && (
            <MessageStatus messageStatus={message.messageStatus} />
          )}
        </span>
      </div>
    </div>
  );
}

export default ImageMessage;
