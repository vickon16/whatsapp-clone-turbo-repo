import React, { useMemo } from "react";
import Avatar from "@/components/ui/avatar";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { defaultAvatar, iconStyle } from "@/utils/constants";
import { useStateProvider } from "@/context/StateContext";

function ChatHeader() {
  const {
    state: { currentChatUser, userInfo, allOnlineUsersId },
    dispatch,
  } = useStateProvider();

  const handleVoiceCall = () => {
    if (!currentChatUser || !userInfo) return;
    dispatch({
      type: "SET_CALL",
      payload: {
        sender: userInfo,
        receiver: currentChatUser,
        dispatchType: "out-going",
        callType: "voice",
        roomId: Date.now(), // used by the zegoCloud
      },
    });
  };
  const handleVideoCall = () => {
    if (!currentChatUser || !userInfo) return;
    dispatch({
      type: "SET_CALL",
      payload: {
        sender: userInfo,
        receiver: currentChatUser,
        dispatchType: "out-going",
        callType: "video",
        roomId: Date.now(), // used by the zegoCloud
      },
    });
  };

  const handleSearch = () => dispatch({ type: "SET_MESSAGE_SEARCH" });

  const isOnline = useMemo(() => {
    return allOnlineUsersId.some((userId) => userId === currentChatUser?.id);
  }, [allOnlineUsersId, currentChatUser?.id]);

  return (
    <header className="z-[10] flex h-20 w-full flex-shrink-0 items-center justify-between bg-background px-4 py-3">
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
          <p className="text-sm text-secondary">
            {isOnline ? "online" : "offline"}
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        <MdCall className={iconStyle} title="Call" onClick={handleVoiceCall} />
        <IoVideocam
          className={iconStyle}
          title="Video Call"
          onClick={handleVideoCall}
        />
        <BiSearchAlt2
          className={iconStyle}
          onClick={handleSearch}
          title="Search"
        />
        <BsThreeDotsVertical className={iconStyle} title="Menu" />
      </div>
    </header>
  );
}

export default ChatHeader;
