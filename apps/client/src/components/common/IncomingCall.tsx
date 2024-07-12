import { useStateProvider } from "@/context/StateContext";
import { TCallSocketType } from "@repo/schemas/types";
import Avatar from "../ui/avatar";
import { socketVariables } from "@repo/constants";

type Props = {
  callData: TCallSocketType;
};
function IncomingCall({ callData }: Props) {
  const {
    state: { socket, userInfo },
    dispatch,
  } = useStateProvider();
  const callType = callData.callType;

  const acceptCall = () => {
    if (!socket || !userInfo) return null;
    const payload = {
      sender: userInfo,
      receiver: callData.sender,
      dispatchType: "in-call",
      callType,
      roomId: callData.roomId,
    } as TCallSocketType;
    // set the call info to the state
    dispatch({ type: "SET_CALL", payload });

    // accept the call so be in sync with the other user (sender).
    socket.emit(socketVariables.acceptIncomingCall, payload);
  };

  const rejectCall = () => {
    if (!socket) return null;
    dispatch({ type: "SET_END_CALL" });
    // reject the call from the sender
    socket.emit(socketVariables.rejectCall, callData.sender.id);
  };

  return (
    <section className="fixed bottom-8 right-6 z-50 mb-0 flex h-fit w-full max-w-96 flex-col gap-5 rounded-sm border-2 border-muted bg-background p-4  text-foreground drop-shadow-2xl">
      <div className="flex gap-2">
        <Avatar size="md" src={callData.sender.image} />

        <div className="space-y-1">
          <h2 className="!text-clampSm">{callData.sender.name}</h2>
          <p className="text-xs text-muted-foreground">
            Incoming {callData.callType === "video" ? "Video" : "Voice"} Call
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end">
        <button
          className="rounded-full bg-red-500 p-1 px-3 text-sm"
          onClick={rejectCall}
        >
          Reject
        </button>
        <button
          className="rounded-full bg-green-500 p-1 px-3 text-sm"
          onClick={acceptCall}
        >
          Accept
        </button>
      </div>
    </section>
  );
}

export default IncomingCall;
