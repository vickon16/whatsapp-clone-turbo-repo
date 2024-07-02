import { useStateProvider } from "@/context/StateContext";
import { useGetAllUsersQuery } from "@/tanstack-hooks/user/queries";
import { cn } from "@/utils";
import { iconStyle } from "@/utils/constants";
import React from "react";
import { BiArrowBack, BiLoaderAlt } from "react-icons/bi";
import SearchBar from "./SearchBar";
import ChatLIstItem from "./ChatLIstItem";

function ContactsList() {
  const { dispatch } = useStateProvider();
  const {
    data: allContacts,
    error,
    isError,
    isFetching,
    isLoading,
  } = useGetAllUsersQuery();

  return (
    <section
      className={cn("flex h-full w-full flex-col", {
        "items-center justify-center px-3":
          isLoading || isFetching || !!error || isError || !allContacts,
      })}
    >
      {isLoading || isFetching ? (
        <>
          <BiLoaderAlt className="size-10 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading Contacts...</p>
        </>
      ) : !!error || isError || !allContacts ? (
        <>
          <h2 className="text-clampMd font-bold text-destructive">Sorry!!!</h2>
          <p className="text-destructive">An Error Has Occurred</p>
        </>
      ) : (
        <>
          <div className="flex h-20 items-center gap-6  px-3">
            <BiArrowBack
              className={iconStyle}
              onClick={() =>
                dispatch({ type: "SET_CURRENT_PAGE", payload: "default" })
              }
            />
            <span>New Chat</span>
          </div>

          <SearchBar isContactSearch />

          <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto bg-primary/50 py-4">
            {Object.entries(allContacts).map(
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
        </>
      )}
    </section>
  );
}

export default ContactsList;
