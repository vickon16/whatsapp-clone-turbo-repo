import { useStateProvider } from "@/context/StateContext";
import { cn } from "@/utils";
import { calculateTime } from "@/utils/CalculateTime";
import { TMessageSchema } from "@repo/schemas/types";
import MessageStatus from "../common/MessageStatus";

type Props = {
  message: TMessageSchema;
  className?: string;
};
const TextMessage = ({ message, className }: Props) => {
  const {
    state: { userInfo, currentChatUser },
  } = useStateProvider();

  return (
    <div
      className={cn(
        "flex max-w-[45%] flex-col rounded-md px-3 py-1 text-sm",
        {
          "bg-background": message.senderId === currentChatUser?.id,
          "bg-emerald-800": message.senderId !== currentChatUser?.id,
        },
        className,
      )}
    >
      <p className="break-all">
        {message.message}
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index}>{"\u00A0"}</span>
        ))}
      </p>
      <p className="flex items-center gap-x-1 self-end">
        <span className="min-w-fit whitespace-nowrap text-[10px] text-link">
          {calculateTime(new Date(message.createdAt).toISOString())}
        </span>
        {message.senderId === userInfo?.id && (
          <MessageStatus messageStatus={message.messageStatus} />
        )}
      </p>
    </div>
  );
};

export default TextMessage;
