import React from "react";
import Avatar from "@/components/ui/avatar";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { defaultAvatar, iconStyle } from "@/utils/constants";
import { useStateProvider } from "@/context/StateContext";

function ChatHeader() {
  const {
    state: { currentChatUser },
  } = useStateProvider();

  return (
    <header className="z-[10] flex h-20 w-full items-center justify-between bg-background px-4 py-3">
      <div className="flex items-center justify-center gap-4">
        <Avatar
          size="sm"
          src={currentChatUser?.image || defaultAvatar}
          alt="user-avatar"
        />
        <div className="flex flex-col">
          <p className="font-semibold text-primary-foreground">
            {currentChatUser?.name || "User"}
          </p>
          <p className="text-sm text-secondary">online / offline</p>
        </div>
      </div>

      <div className="flex gap-6">
        <MdCall className={iconStyle} title="Call" />
        <IoVideocam className={iconStyle} title="Video Call" />
        <BiSearchAlt2 className={iconStyle} title="Search" />
        <BsThreeDotsVertical className={iconStyle} title="Menu" />
      </div>
    </header>
  );
}

export default ChatHeader;
