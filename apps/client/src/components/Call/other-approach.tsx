// import { useStateProvider } from "@/context/StateContext";
// import { socketVariables } from "@repo/constants";
// import { TCallSocketType } from "@repo/schemas/types";
// import { useEffect, useState } from "react";
// import { MdOutlineCallEnd } from "react-icons/md";
// import { type ZegoExpressEngine } from "zego-express-engine-webrtc";
// import Avatar from "../ui/avatar";
// import { env } from "@/env";
// import { API } from "@/utils";
// import { appLinks } from "@/utils/appLinks";

// type Props = {
//   callData: TCallSocketType;
// };

// function Call({ callData }: Props) {
//   const {
//     state: { socket, userInfo },
//     dispatch,
//   } = useStateProvider();
//   const callType = callData.callType;
//   const isInCall = callData.dispatchType === "in-call";
//   const [zegoVar, setZegoVar] = useState<ZegoExpressEngine | undefined>(
//     undefined,
//   );
//   const [localStream, setLocalStream] = useState<MediaStream | undefined>(
//     undefined,
//   );
//   const [publishStreamId, setPublishStreamId] = useState<string | undefined>(
//     undefined,
//   );
//   const [token, setToken] = useState<string | undefined>(undefined);

//   useEffect(() => {
//     if (!socket || !userInfo || callData.dispatchType !== "out-going") return;
//     socket.emit(socketVariables.outGoingCall, {
//       dispatchType: "out-going",
//       sender: userInfo,
//       receiver: callData.receiver,
//       callType: callType,
//       roomId: callData.roomId,
//     } satisfies TCallSocketType);
//   }, [callData.dispatchType, userInfo?.id]);

//   useEffect(() => {
//     if (!!token || !userInfo?.id || !isInCall) return;

//     const getToken = async () => {
//       const response = await API.get(
//         `${appLinks.generateToken}/${userInfo.id}`,
//       );
//       if (!response.data.success || !response.data.data) {
//         throw new Error(response.data.msg);
//       }

//       console.log({ token: response.data.data });
//       setToken(response.data.data as string);
//     };

//     getToken();
//   }, [token, userInfo?.id]);

//   useEffect(() => {
//     if (!token || !userInfo || !isInCall) return;

//     const startCall = async () => {
//       import("zego-express-engine-webrtc")
//         .then(async ({ ZegoExpressEngine }) => {
//           const zego = new ZegoExpressEngine(
//             parseInt(env.NEXT_PUBLIC_FIREBASE_APP_ID),
//             env.NEXT_PUBLIC_ZEGO_SERVER_SECRET,
//           );
//           setZegoVar(zego);

//           zego.on(
//             "roomStreamUpdate",
//             async (roomID, updateType, streamList, extendedData) => {
//               if (!streamList[0]?.streamID) return;
//               const streamId = streamList[0].streamID;
//               if (updateType === "ADD") {
//                 const remoteVideo = document.getElementById("remote-video");
//                 const media = document.createElement(
//                   callType === "video" ? "video" : "audio",
//                 );
//                 media.id = streamId;
//                 media.autoplay = true;
//                 // @ts-ignore
//                 media.playsInline = true;
//                 media.muted = false;

//                 if (remoteVideo) remoteVideo.appendChild(media);

//                 zego
//                   .startPlayingStream(streamId, {
//                     audio: true,
//                     video: callType === "video" ? true : false,
//                   })
//                   .then((stream) => (media.srcObject = stream));
//               } else if (
//                 updateType === "DELETE" &&
//                 !!zego &&
//                 !!localStream &&
//                 !!streamId
//               ) {
//                 zego.destroyStream(localStream);
//                 zego.stopPublishingStream(streamId);
//                 zego.logoutRoom(callData.roomId.toString());
//                 dispatch({ type: "SET_END_CALL" });
//               }
//             },
//           );

//           await zego.loginRoom(
//             callData.roomId.toString(),
//             token,
//             {
//               userID: userInfo.id.toString(),
//               userName: userInfo.name,
//             },
//             { userUpdate: true },
//           );

//           const localStream = await zego.createStream({
//             camera: {
//               audio: true,
//               video: callType === "video" ? true : false,
//             },
//           });

//           const localVideo = document.getElementById("local-audio");
//           const media = document.createElement(
//             callType === "video" ? "video" : "audio",
//           );
//           media.id = "video-local-zego";
//           media.className = "h-28 w-32";
//           media.autoplay = true;
//           // @ts-ignore
//           media.playsInline = true;
//           media.muted = false;

//           localVideo?.appendChild(media);

//           const td = document.getElementById("video-local-zego") as
//             | HTMLAudioElement
//             | HTMLVideoElement;
//           td.srcObject = localStream;
//           const streamId = "zego-" + Date.now();
//           setPublishStreamId(streamId);
//           setLocalStream(localStream);

//           zego.startPublishingStream(streamId, localStream);
//         })
//         .catch((reason) => {
//           console.log(reason);
//         });
//     };

//     startCall();
//   }, [token, isInCall]);

//   const endCall = () => {
//     if (!socket || !userInfo || !zegoVar || !localStream || !publishStreamId)
//       return;

//     zegoVar.destroyStream(localStream);
//     zegoVar.stopPublishingStream(publishStreamId);
//     zegoVar.logoutRoom(callData.roomId.toString());

//     dispatch({ type: "SET_END_CALL" });

//     // reject our own call, we also trigger the other user modal call end as well.
//     socket.emit(
//       socketVariables.rejectCall,
//       userInfo.id === callData.receiver.id
//         ? callData.sender.id
//         : callData.receiver.id,
//     );
//   };

//   return (
//     <section className="h-screen max-h-full w-screen overflow-hidden">
//       <section className="flex h-full flex-col items-center justify-center overflow-hidden border-l border-primary bg-muted/70 text-foreground">
//         <div className="flex flex-col items-center gap-3">
//           <p className="text-3xl">{callData.receiver.name}</p>
//           <p className="text-clampMd text-muted-foreground">
//             {isInCall && callType !== "video" ? "On going call" : "Calling..."}
//           </p>
//         </div>
//         {(!isInCall || callType === "voice") && (
//           <div className="my-12">
//             <Avatar size="2xl" src={callData.receiver.image} />
//           </div>
//         )}

//         <div className="relative my-5" id="remote-video">
//           <div className="absolute bottom-5 right-5" id="local-audio"></div>
//         </div>

//         <div
//           className="flex size-16 cursor-pointer items-center justify-center rounded-full bg-red-600"
//           onClick={endCall}
//         >
//           <MdOutlineCallEnd className="text-clampLg" />
//         </div>
//       </section>
//     </section>
//   );
// }

// export default Call;
