import { useStateProvider } from "@/context/StateContext";
import { env } from "@/env";
import { socketVariables } from "@repo/constants";
import { TCallSocketType } from "@repo/schemas/types";
import { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
import Avatar from "../ui/avatar";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

type Props = {
  callData: TCallSocketType;
};

function Call({ callData }: Props) {
  const {
    state: { socket, userInfo },
    dispatch,
  } = useStateProvider();
  const callType = callData.callType;
  const isInCall = callData.dispatchType === "in-call";
  const [zpState, setZPState] = useState<ZegoUIKitPrebuilt | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!socket || !userInfo || callData.dispatchType !== "out-going") return;
    socket.emit(socketVariables.outGoingCall, {
      dispatchType: "out-going",
      sender: userInfo,
      receiver: callData.receiver,
      callType: callType,
      roomId: callData.roomId,
    } satisfies TCallSocketType);
  }, [callData.dispatchType, userInfo?.id]);

  const startCall = async (element: HTMLDivElement) => {
    if (!userInfo) return;
    const { ZegoUIKitPrebuilt } = await import(
      "@zegocloud/zego-uikit-prebuilt"
    );
    const app_Id = parseInt(env.NEXT_PUBLIC_ZEGO_APP_ID);
    const serverSecret = env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      app_Id,
      serverSecret,
      callData.roomId.toString(),
      userInfo.id,
      userInfo.name,
      10000, // expires in 10 seconds
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    setZPState(zp);
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            callData.roomId,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },

      onLeaveRoom: () => {
        if (!socket) return;
        dispatch({ type: "SET_END_CALL" });
        zp.destroy();
        zp.hangUp();

        // reject our own call, we also trigger the other user modal call end as well.
        socket.emit(
          socketVariables.rejectCall,
          userInfo.id === callData.receiver.id
            ? callData.sender.id
            : callData.receiver.id,
        );
      },
    });
  };

  const endCall = () => {
    if (!socket || !userInfo || !zpState) return;

    dispatch({ type: "SET_END_CALL" });

    zpState.destroy();
    zpState.hangUp();

    // reject our own call, we also trigger the other user modal call end as well.
    socket.emit(
      socketVariables.rejectCall,
      userInfo.id === callData.receiver.id
        ? callData.sender.id
        : callData.receiver.id,
    );
  };

  return isInCall ? (
    <div className="h-screen max-h-screen w-screen " ref={startCall} />
  ) : (
    <section className="h-screen max-h-full w-screen overflow-hidden">
      <section className="flex h-full flex-col items-center justify-center overflow-hidden border-l border-primary bg-muted/70 text-foreground">
        <div className="flex flex-col items-center gap-3">
          <p className="text-3xl">{callData.receiver.name}</p>
          <p className="text-clampMd text-muted-foreground">
            {isInCall && callType !== "video" ? "On going call" : "Calling..."}
          </p>
        </div>
        {(!isInCall || callType === "voice") && (
          <div className="my-12">
            <Avatar size="2xl" src={callData.receiver.image} />
          </div>
        )}

        <div
          className="flex size-16 cursor-pointer items-center justify-center rounded-full bg-red-600"
          onClick={endCall}
        >
          <MdOutlineCallEnd className="text-clampLg" />
        </div>
      </section>
    </section>
  );
}

export default Call;
