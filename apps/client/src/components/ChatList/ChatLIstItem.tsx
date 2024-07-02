import Avatar from "@/components/ui/avatar";
import { useStateProvider } from "@/context/StateContext";
import { cn } from "@/utils";
import { calculateTime } from "@/utils/CalculateTime";
import { defaultAvatar } from "@/utils/constants";
import { user } from "@repo/db";
import { TMessageSchema } from "@repo/schemas/types";

type Props = {
  user: user;
  isContactPage?: boolean;
  lastMessage?: TMessageSchema[];
  unreadMessagesLength?: number;
};
function ChatLIstItem({
  user,
  isContactPage = false,
  unreadMessagesLength,
  lastMessage,
}: Props) {
  const {
    state: { userInfo },
    dispatch,
  } = useStateProvider();

  const handleContactClick = () => {
    const { isOnBoard, ...other } = user;
    dispatch({ type: "SET_CURRENT_CHAT_USER", payload: other });
    dispatch({ type: "SET_CURRENT_PAGE", payload: "default" });
  };

  const isShowHighLight =
    !!lastMessage?.[0] &&
    lastMessage[0].senderId !== userInfo?.id &&
    lastMessage[0]?.messageStatus !== "read";
  const isShowBadge =
    !!lastMessage?.[0] &&
    !!unreadMessagesLength &&
    lastMessage[0].senderId !== userInfo?.id;

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-x-2 px-5 hover:bg-background/80",
      )}
      onClick={handleContactClick}
    >
      <Avatar
        size="md"
        src={user.image || defaultAvatar}
        imageContainerClassName="flex-shrink-0"
      />

      <div className="mt-3 min-h-full w-full">
        <div className="flex justify-between gap-2">
          <span className="line-clamp-1">{user.name}</span>
          {!!lastMessage?.[0] && (
            <span className="text-xs text-muted-foreground">
              {calculateTime(new Date(lastMessage[0].createdAt).toISOString())}
            </span>
          )}
        </div>
        <div className="flex justify-between gap-2 border-b border-border/20 pb-2 pt-1">
          <span className="flex w-full items-center justify-between">
            {!!lastMessage?.[0] ? (
              <span
                className={cn("line-clamp-1 text-xs text-muted-foreground", {
                  "font-semibold text-emerald-300": isShowHighLight,
                })}
              >
                {lastMessage[0]?.message}
              </span>
            ) : (
              <span
                className={cn("line-clamp-1 text-xs text-muted-foreground")}
              >
                {user.bio || "\u00A0"}
              </span>
            )}
          </span>
          {isShowBadge && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
              {unreadMessagesLength}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatLIstItem;
