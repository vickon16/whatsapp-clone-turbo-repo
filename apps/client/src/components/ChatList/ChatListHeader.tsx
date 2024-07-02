import Avatar from "@/components/ui/avatar";
import { useStateProvider } from "@/context/StateContext";
import { defaultAvatar, iconStyle } from "@/utils/constants";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";

function ChatListHeader() {
  const { state, dispatch } = useStateProvider();

  return (
    <header className="flex h-20 items-center justify-between px-4">
      <div className="cursor-pointer">
        <Avatar size="sm" src={state.userInfo?.image || defaultAvatar} />
      </div>

      <div className="flex items-center gap-6">
        <BsFillChatLeftTextFill
          className={iconStyle}
          title="New Chat"
          onClick={() =>
            dispatch({ type: "SET_CURRENT_PAGE", payload: "all-contacts" })
          }
        />
        <BsThreeDotsVertical className={iconStyle} title="Menu" />
      </div>
    </header>
  );
}

export default ChatListHeader;
