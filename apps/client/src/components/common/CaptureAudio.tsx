import { useStateProvider } from "@/context/StateContext";
import { formatAudioTime } from "@/utils";
import { iconStyle } from "@/utils/constants";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

type Props = {
  hide: () => void;
  setRenderedAudio: Dispatch<SetStateAction<File | null>>;
  sendAudioMessage: () => Promise<void>;
};

function CaptureAudio({ hide, setRenderedAudio, sendAudioMessage }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
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
    handleStartRecording(createdWaveSurfer);

    createdWaveSurfer.on("finish", () => setIsPlaying(false));
    return () => {
      createdWaveSurfer.unAll();
      createdWaveSurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setRecordingDuration((previousDuration) => {
        return previousDuration + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = async (waveSurfer: WaveSurfer) => {
    if (!waveSurfer || !audioRef.current) return;
    setRecordingDuration(0);
    setCurrentPlayBackTime(0);
    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioRef.current.srcObject = stream;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => chunks.push(event.data);

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        const audioUrl = URL.createObjectURL(blob);
        waveSurfer.load(audioUrl);
      };

      mediaRecorder.start();
    } catch (error) {
      console.log("Error accessing microphone", error);
    }
  };

  const handleStopRecording = (waveSurfer: WaveSurfer) => {
    if (!mediaRecorderRef.current || !isRecording) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    waveSurfer.stop();

    const audioChunks: Blob[] = [];
    mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });
    mediaRecorderRef.current.addEventListener("stop", () => {
      const audioType = { type: "audio/mp3" };
      const audioBlob = new Blob(audioChunks, audioType);
      const audioFile = new File([audioBlob], "recording.mp3", audioType);
      setRenderedAudio(audioFile);
    });
  };

  const handlePlayRecording = () => {
    if (!waveSurfer) return;
    waveSurfer.play();
    setIsPlaying(true);
  };

  const handlePauseRecording = () => {
    if (!waveSurfer) return;
    waveSurfer.pause();
    setIsPlaying(false);
  };

  return (
    <div className="flex w-full items-center justify-end text-2xl">
      <FaTrash className={iconStyle} onClick={hide} />
      <div className="mx-4 flex items-center justify-center gap-3 rounded-full bg-primary/50 p-2 text-clampMd text-foreground shadow-lg">
        {isRecording ? (
          <span className="w-60 animate-pulse text-center text-red-500">
            Recording <span>{recordingDuration}s</span>
          </span>
        ) : (
          <>
            <span>
              {isPlaying && <FaStop onClick={handlePauseRecording} />}
              {!isPlaying && <FaPlay onClick={handlePlayRecording} />}
            </span>
            <span>{formatAudioTime(currentPlayBackTime)}</span>
          </>
        )}

        <div className="w-60" ref={waveSurferRef} hidden={isRecording} />

        <audio ref={audioRef} hidden />

        <div className="mr-4">
          {!isRecording ? (
            <FaMicrophone
              className="text-red-500"
              onClick={() => waveSurfer && handleStartRecording(waveSurfer)}
            />
          ) : (
            <FaPauseCircle
              className="text-red-500"
              onClick={() => waveSurfer && handleStopRecording(waveSurfer)}
            />
          )}
        </div>

        {!isRecording && (
          <button>
            <MdSend
              className={iconStyle}
              title="send"
              onClick={() => {
                hide();
                sendAudioMessage();
              }}
            />
          </button>
        )}
      </div>
    </div>
  );
}

export default CaptureAudio;
