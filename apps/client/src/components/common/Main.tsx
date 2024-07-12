import Chat from "@/components/Chat";
import ChatList from "@/components/ChatList";
import Empty from "@/components/common/Empty";
import { useStateProvider } from "@/context/StateContext";
import { useGetAllUserPairsQuery } from "@/tanstack-hooks/message/queries";
import {
  useGetAllOnlineUsersIdQuery,
  useGetAllUsersQuery,
} from "@/tanstack-hooks/user/queries";
import { cn } from "@/utils";
import { BiLoaderAlt } from "react-icons/bi";
import SearchMessages from "../Chat/SearchMessages";
import IncomingCall from "./IncomingCall";
import dynamic from "next/dynamic";
const Call = dynamic(() => import("../Call"));

function Main() {
  const {
    state: { userInfo, currentChatUser, messageSearch, call },
  } = useStateProvider();

  const allUsersQuery = useGetAllUsersQuery();
  const allUsersPairQuery = useGetAllUserPairsQuery(userInfo?.id);
  const allOnlineUsersIdQuery = useGetAllOnlineUsersIdQuery();

  const isLoading =
    allUsersQuery.isLoading ||
    allUsersPairQuery.isLoading ||
    allOnlineUsersIdQuery.isLoading;
  const isError =
    allUsersQuery.isError ||
    allUsersPairQuery.isError ||
    allOnlineUsersIdQuery.isError;
  const isNoData =
    !allUsersQuery.data ||
    !allUsersPairQuery.data ||
    !allOnlineUsersIdQuery.data;

  return (
    <>
      {!!call && call.dispatchType === "in-coming" && (
        <IncomingCall callData={call} />
      )}

      {!!call && call.dispatchType !== "in-coming" ? (
        <Call callData={call} />
      ) : (
        <section
          className={cn(
            "grid h-screen max-h-screen w-screen max-w-full grid-cols-[auto,1fr] overflow-hidden",
            {
              "flex flex-col items-center justify-center gap-1":
                isLoading || isError,
            },
          )}
        >
          {isLoading && isNoData ? (
            <>
              <BiLoaderAlt className="size-10 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Loading Contacts...
              </p>
            </>
          ) : isError && isNoData ? (
            <>
              <h2 className="text-clampMd font-bold text-destructive">
                Sorry!!!
              </h2>
              <p className="text-destructive">An Error Has Occurred</p>
            </>
          ) : (
            <>
              <ChatList />
              {!!currentChatUser ? (
                <div
                  className={cn("", {
                    "grid grid-cols-3": messageSearch,
                  })}
                >
                  <Chat />
                  {messageSearch && <SearchMessages />}
                </div>
              ) : (
                <Empty />
              )}
            </>
          )}
        </section>
      )}
    </>
  );
}

export default Main;
