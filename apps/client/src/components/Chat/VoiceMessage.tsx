import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import { TMessageSchema } from "@repo/schemas/types";
import React, { useEffect, useRef, useState } from "react";
import MessageStatus from "@/components/common/MessageStatus";
import { cn, formatAudioTime } from "@/utils";
import WaveSurfer from "wavesurfer.js";
import Avatar from "../ui/avatar";
import { defaultAvatar } from "@/utils/constants";
import { FaPlay, FaStop } from "react-icons/fa";
import { env } from "@/env";

type Props = {
  message: TMessageSchema;
};

function VoiceMessage({ message }: Props) {
  const {
    state: { currentChatUser, userInfo },
  } = useStateProvider();
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveSurferRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!waveSurferRef.current) return;
    const createdWaveSurfer = WaveSurfer.create({
      container: waveSurferRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
    });

    createdWaveSurfer.on("audioprocess", (currentTime) => {
      return setCurrentPlayBackTime(currentTime);
    });

    createdWaveSurfer.on("seeking", function () {
      const currentTime = createdWaveSurfer.getCurrentTime();
      return setCurrentPlayBackTime(currentTime);
    });

    setWaveSurfer(createdWaveSurfer);
    createdWaveSurfer.on("finish", () => setIsPlaying(false));
    return () => {
      createdWaveSurfer.unAll();
      createdWaveSurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (!waveSurfer || !audioRef.current || !message.message) return;
    const audioUrl = `${env.NEXT_PUBLIC_SERVER_URL}/${message.message}`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    waveSurfer.load(audioUrl);
    waveSurfer.on("ready", () => {
      setRecordingDuration(waveSurfer.getDuration());
    });
  }, [waveSurfer, message.message]);

  const handlePlayAudio = () => {
    if (!waveSurfer) return;
    waveSurfer.play();
    setIsPlaying(true);
  };

  const handlePauseAudio = () => {
    if (!waveSurfer) return;
    waveSurfer.pause();
    setIsPlaying(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-md px-3 py-2 text-sm text-foreground",
        {
          "bg-background": message.senderId === currentChatUser?.id,
          "bg-emerald-800": message.senderId !== currentChatUser?.id,
        },
      )}
    >
      <div className="flex items-center gap-2">
        <Avatar size="md" src={currentChatUser?.image || defaultAvatar} />

        <div className="cursor-pointer text-clampMd">
          {!isPlaying ? (
            <FaPlay onClick={handlePlayAudio} />
          ) : (
            <FaStop onClick={handlePauseAudio} />
          )}
        </div>

        <div className="w-60" ref={waveSurferRef} />
        <audio ref={audioRef} hidden />
      </div>

      <div className="flex w-full justify-end gap-3 text-xs text-link">
        <span>
          {formatAudioTime(isPlaying ? currentPlayBackTime : recordingDuration)}
        </span>
        <div className="flex gap-1 self-end">
          <span className="min-w-fit whitespace-nowrap text-[10px] text-link">
            {calculateTime(new Date(message.createdAt).toISOString())}
          </span>
          <span className="text-[hsla(0,0%,100%,0.6)]">
            {message.senderId === userInfo?.id && (
              <MessageStatus messageStatus={message.messageStatus} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;
