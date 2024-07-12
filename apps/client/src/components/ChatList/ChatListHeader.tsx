import Avatar from "@/components/ui/avatar";
import { useStateProvider } from "@/context/StateContext";
import { defaultAvatar, iconStyle } from "@/utils/constants";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { socketVariables } from "@repo/constants";
import { signOut } from "firebase/auth";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";

function ChatListHeader() {
  const {
    state: { socket, userInfo },
    dispatch,
  } = useStateProvider();

  return (
    <header className="flex h-20 items-center justify-between px-4">
      <div className="cursor-pointer">
        <Avatar size="sm" src={userInfo?.image || defaultAvatar} />
      </div>

      <div className="flex items-center gap-6">
        <FiLogOut
          className={iconStyle}
          title="Log Out"
          onClick={async () => {
            await signOut(firebaseAuth);
            {
              socket &&
                userInfo &&
                socket.emit(socketVariables.signOutUser, userInfo.id);
            }
            dispatch({ type: "LOG_OUT" });
          }}
        />
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
