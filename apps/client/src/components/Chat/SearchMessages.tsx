import { useStateProvider } from "@/context/StateContext";
import { iconStyle } from "@/utils/constants";
import React, { useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import SearchBar from "../ChatList/SearchBar";
import { calculateTime } from "@/utils/CalculateTime";
import { TMessageSchema } from "@repo/schemas/types";
import TextMessage from "./TextMessage";

function SearchMessages() {
  const {
    state: { currentChatUser, allUserPairs },
    dispatch,
  } = useStateProvider();
  const [searchTerm, setSearchTerm] = useState("");

  const searchMessages = useMemo(() => {
    if (!searchTerm || !currentChatUser) return [];
    const currentUserPairMessage = allUserPairs.find((userPair) =>
      userPair.id.includes(currentChatUser?.id),
    );

    if (!currentUserPairMessage) return [];
    const filteredMessages = currentUserPairMessage.messages.filter(
      (pair) =>
        pair.type === "text" &&
        pair.message.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return filteredMessages || [];
  }, [searchTerm]);

  return (
    <section className="z-[10] col-span-1 flex h-screen w-full flex-col border-l border-primary bg-primary/70">
      <header className="z-[10] flex h-20 w-full flex-shrink-0 items-center gap-x-6 bg-background px-4 py-3">
        <IoClose
          className={iconStyle}
          onClick={() => dispatch({ type: "SET_MESSAGE_SEARCH" })}
        />
        <span className="text-link">Search Messages</span>
      </header>

      <section className="custom-scrollbar relative flex h-full w-full flex-auto flex-col overflow-y-auto p-4">
        <SearchBar
          isMessageSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {searchTerm.length === 0 && (
          <p className="text-center text-xs text-muted-foreground">
            Search for messages for {currentChatUser?.name}
          </p>
        )}

        <div className="flex h-full w-full flex-col items-center justify-center">
          {searchTerm.length > 0 && searchMessages.length === 0 && (
            <span className="flex w-full justify-center text-secondary">
              No messages found
            </span>
          )}

          <div className="flex h-full w-full flex-col gap-y-2 pt-4">
            {searchMessages.map((message) => (
              <TextMessage message={message} className="w-full max-w-full" />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

export default SearchMessages;
