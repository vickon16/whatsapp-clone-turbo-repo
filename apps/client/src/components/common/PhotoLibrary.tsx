import { convertImageToFile } from "@/utils";
import Image from "next/image";
import React from "react";
import { IoClose } from "react-icons/io5";

const images = [
  { name: "avatar1", src: "/avatars/1.png" },
  { name: "avatar2", src: "/avatars/2.png" },
  { name: "avatar3", src: "/avatars/3.png" },
  { name: "avatar4", src: "/avatars/4.png" },
  { name: "avatar5", src: "/avatars/5.png" },
  { name: "avatar6", src: "/avatars/6.png" },
  { name: "avatar7", src: "/avatars/7.png" },
  { name: "avatar8", src: "/avatars/8.png" },
  { name: "avatar9", src: "/avatars/9.png" },
];

type Props = {
  setImageFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  closePhotoLibrary: () => void;
};

function PhotoLibrary({ setImageFile, closePhotoLibrary }: Props) {
  const photoLibraryChange = async (image: (typeof images)[number]) => {
    const name = image.name + "-" + new Date().getTime().toString();
    const file = await convertImageToFile(image.src, name);
    setImageFile(file);
    closePhotoLibrary();
  };
  return (
    <div className="fixed inset-0 flex h-full max-h-[100vh] w-full max-w-[100vw] items-center justify-center">
      <div className="h-max w-max rounded-lg bg-primary p-2">
        <div
          className="flex cursor-pointer items-end justify-end pr-2 pt-2"
          onClick={closePhotoLibrary}
        >
          <IoClose className="size-5 cursor-pointer" />
        </div>

        <div className="space-y-6 px-4 py-6">
          <h2 className="!text-clampSm font-semibold text-muted-foreground">
            Our Avatars
          </h2>
          <div className="grid w-full grid-cols-3 items-center justify-center gap-8 px-4">
            {images.map((image) => (
              <div
                className="relative aspect-square h-24 cursor-pointer"
                key={image.name}
                onClick={() => photoLibraryChange(image)}
              >
                <Image
                  src={image.src}
                  alt="avatar"
                  className="h-full w-full object-center"
                  fill
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoLibrary;
