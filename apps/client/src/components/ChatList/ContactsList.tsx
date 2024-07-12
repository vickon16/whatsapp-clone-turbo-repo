import { useStateProvider } from "@/context/StateContext";
import { cn } from "@/utils";
import { iconStyle } from "@/utils/constants";
import { user } from "@repo/db";
import { useMemo, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";
import SearchBar from "./SearchBar";

function ContactsList() {
  const {
    state: { allUsers },
    dispatch,
  } = useStateProvider();
  const [searchTerm, setSearchTerm] = useState("");

  const allUsersGroup = useMemo(() => {
    // group users by their initial letters e.g {U : [{name : User1}]}
    return allUsers
      .filter((users) =>
        !!searchTerm
          ? users.name.toLowerCase().includes(searchTerm.toLowerCase())
          : users,
      )
      .reduce((acc: any, obj) => {
        const firstLetter = obj?.name?.charAt(0).toUpperCase();
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push(obj);

        return acc;
      }, {}) as {
      [key: string]: user[];
    };
  }, [searchTerm]);

  return (
    <section className={cn("flex h-full w-full flex-col")}>
      <div className="flex h-20 items-center gap-6  px-3">
        <BiArrowBack
          className={iconStyle}
          onClick={() =>
            dispatch({ type: "SET_CURRENT_PAGE", payload: "default" })
          }
        />
        <span>New Chat</span>
      </div>

      <SearchBar
        isContactSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto bg-primary/50 py-4">
        {Object.entries(allUsersGroup).map(
          ([initialLetter, userList], index) => {
            return (
              <div key={index + initialLetter}>
                <p className="p-4 font-semibold text-teal-400">
                  {initialLetter}
                </p>
                <div className="space-y-1">
                  {userList.map((user) => (
                    <ChatLIstItem key={user.id} user={user} isContactPage />
                  ))}
                </div>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}

export default ContactsList;
