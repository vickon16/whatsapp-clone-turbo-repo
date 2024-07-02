import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/button";

type Props = {
  setImageFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  closePhotoLibrary: () => void;
};

function TakePhoto({ setImageFile, closePhotoLibrary }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    let stream: MediaStream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.log(error);
      }
    };

    void startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const stopCamera = () => {
    if (!videoRef.current) return;
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const name = "photo.jpg" + "-" + new Date().getTime().toString();
      const file = new File([blob], name, { type: "image/jpeg" });
      setImageFile(file);
      closePhotoLibrary();
      stopCamera();
    }, "image/jpeg");
  };

  return (
    <div className="fixed inset-0 flex h-full max-h-[100vh] w-full max-w-[100vw] items-center justify-center">
      <div className=" w-fit rounded-lg bg-primary p-2">
        <div
          className="flex cursor-pointer items-end justify-end pr-2 pt-2"
          onClick={closePhotoLibrary}
        >
          <IoClose className="size-5 cursor-pointer" />
        </div>

        <div className="space-y-6 px-4 py-6">
          <h2 className="!text-clampSm font-semibold text-muted-foreground">
            Take a photo
          </h2>

          <div className="flex w-full flex-col justify-center gap-y-4">
            <video
              id="video"
              className="h-[400px] w-full"
              autoPlay
              ref={videoRef}
            ></video>
            <Button
              className="mx-auto h-16 w-16 rounded-full border-8 border-teal-400 bg-foreground"
              onClick={capturePhoto}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TakePhoto;
