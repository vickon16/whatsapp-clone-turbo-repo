import { useStateProvider } from "@/context/StateContext";
import ChatLIstItem from "./ChatLIstItem";
import { useMemo } from "react";

type Props = {
  searchTerm: string;
};

function List({ searchTerm }: Props) {
  const {
    state: { userInfo, allUserPairs, allUsers, currentChatUser },
  } = useStateProvider();

  const allUserPairsFilter = useMemo(() => {
    const allUserPairsData = allUserPairs.map((userPairs) => {
      const displayUser = allUsers.find(
        (user) => userPairs.id.includes(user.id) && user.id !== userInfo?.id,
      );
      return {
        ...userPairs,
        chatDisplayUser: displayUser || null,
      };
    });

    if (!!searchTerm)
      return allUserPairsData.filter((userPair) =>
        userPair.chatDisplayUser?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );

    return allUserPairsData;
  }, [allUserPairs, searchTerm]);

  return (
    <section className="custom-scrollbar max-h-full w-full flex-auto overflow-y-auto bg-primary/50">
      <div className="flex flex-col gap-1 py-4">
        {allUserPairsFilter.length === 0 ? (
          <div
            className={
              "flex h-full w-full flex-col items-center justify-center gap-1 p-2"
            }
          >
            <h2 className="text-clampMd font-semibold">No Chats Found</h2>
            <p className="text-xs text-muted-foreground">
              Start a new conversation
            </p>
          </div>
        ) : (
          allUserPairsFilter.map((userPair) => {
            if (!userPair.chatDisplayUser) return null;
            return (
              <ChatLIstItem
                key={userPair.id}
                user={userPair.chatDisplayUser}
                isContactPage
                lastMessage={userPair.messages?.slice(-1)}
                unreadMessagesLength={
                  userPair.messages?.filter(
                    (message) =>
                      message.messageStatus !== "read" &&
                      message.senderId === userPair.chatDisplayUser?.id,
                  ).length
                }
              />
            );
          })
        )}
      </div>
    </section>
  );
}

export default List;
