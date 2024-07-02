import { useStateProvider } from "@/context/StateContext";
import { useGetChatListMessagesQuery } from "@/tanstack-hooks/message/queries";
import { BiLoaderAlt } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";

const centerClass =
  "flex h-full w-full flex-col items-center justify-center gap-1 p-2";

function List() {
  const {
    state: { userInfo },
  } = useStateProvider();

  const {
    data: chatList,
    isError,
    isFetching,
    isLoading,
    error,
  } = useGetChatListMessagesQuery(userInfo?.id);

  return (
    <section className="custom-scrollbar max-h-full w-full flex-auto overflow-y-auto bg-primary/50">
      {isLoading || isFetching ? (
        <div className={centerClass}>
          <BiLoaderAlt className="size-10 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading Chats...</p>
        </div>
      ) : isError || !!error ? (
        <div className={centerClass}>
          <h2 className="text-clampMd font-bold text-destructive">Sorry!!!</h2>
          <p className="text-destructive">An Error Has Occurred</p>
        </div>
      ) : !Array.isArray(chatList) || chatList.length === 0 ? (
        <div className={centerClass}>
          <h2 className="text-clampMd font-semibold">No Chats Found</h2>
          <p className="text-xs text-muted-foreground">
            Start a new conversation
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1 py-4">
          {chatList.map((contact) => (
            <ChatLIstItem
              key={contact.id}
              user={
                contact.receiver?.id === userInfo?.id
                  ? contact.sender
                  : contact.receiver
              }
              isContactPage
              lastMessage={contact.lastMessage}
              unreadMessagesLength={contact.unreadMessagesLength}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default List;
