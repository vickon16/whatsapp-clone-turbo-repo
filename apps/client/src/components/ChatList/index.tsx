import ChatListHeader from "@/components/ChatList/ChatListHeader";
import List from "@/components/ChatList/List";
import SearchBar from "@/components/ChatList/SearchBar";
import { useStateProvider } from "@/context/StateContext";
import ContactsList from "./ContactsList";
import { useState } from "react";

function ChatList() {
  const {
    state: { currentPage },
  } = useStateProvider();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <aside className="z-[20] flex h-screen min-w-[250px] max-w-[450px] flex-col border-r border-border/70 bg-background lg:min-w-[350px] xl:min-w-[450px]">
      {currentPage === "default" && (
        <>
          <ChatListHeader />
          <SearchBar
            isChatListSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <List searchTerm={searchTerm} />
        </>
      )}

      {currentPage === "all-contacts" && <ContactsList />}
    </aside>
  );
}

export default ChatList;
