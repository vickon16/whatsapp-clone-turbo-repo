import { TMessageSchema } from "@repo/schemas/types";
import React from "react";
import { BsCheck, BsCheckAll } from "react-icons/bs";

type Props = {
  messageStatus: TMessageSchema["messageStatus"];
};

function MessageStatus({ messageStatus }: Props) {
  return (
    <>
      {messageStatus === "sent" && <BsCheck className="size-4" />}
      {messageStatus === "delivered" && <BsCheckAll className="size-4" />}
      {messageStatus === "read" && (
        <BsCheckAll className="size-4 text-cyan-400" />
      )}
    </>
  );
}

export default MessageStatus;
