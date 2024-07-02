import ChatListHeader from "@/components/ChatList/ChatListHeader";
import List from "@/components/ChatList/List";
import SearchBar from "@/components/ChatList/SearchBar";
import { useStateProvider } from "@/context/StateContext";
import ContactsList from "./ContactsList";

function ChatList() {
  const { state } = useStateProvider();

  return (
    <aside className="z-[20] flex h-screen min-w-[250px] max-w-[450px] flex-col border-r border-border/70 bg-background lg:min-w-[350px] xl:min-w-[450px]">
      {state.currentPage === "default" && (
        <>
          <ChatListHeader />
          <SearchBar />
          <List />
        </>
      )}

      {state.currentPage === "all-contacts" && <ContactsList />}
    </aside>
  );
}

export default ChatList;
