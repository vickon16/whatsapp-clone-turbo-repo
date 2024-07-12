import { cn } from "@/utils";
import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import * as React from "react";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "../common/ContextMenu";
import PhotoLibrary from "../common/PhotoLibrary";
import TakePhoto from "../common/TakePhoto";
import { defaultAvatar } from "@/utils/constants";

type DefaultAvatarProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string | StaticImport;
  imageContainerClassName?: string;
};

type ConditionalAvatarProps =
  | {
      size: "sm" | "md" | "lg" | "2xl";
      setImage?: never;
      imageFile?: never;
      setImageFile?: never;
    }
  | {
      size: "xl";
      setImage: React.Dispatch<React.SetStateAction<string>>;
      imageFile: File | undefined;
      setImageFile: React.Dispatch<React.SetStateAction<File | undefined>>;
    };

type CombinedProps = DefaultAvatarProps & ConditionalAvatarProps;

const contextIdentifier = "image-context-opener";

const Avatar = React.forwardRef<HTMLImageElement, CombinedProps>(
  (
    {
      className,
      size = "md",
      src,
      imageContainerClassName,
      imageFile,
      setImageFile,
      setImage,
    },
    ref,
  ) => {
    const [isContextVisible, setIsContextVisible] = React.useState(false);
    const [contextCoordinates, setContextCoordinates] = React.useState({
      x: 0,
      y: 0,
    });
    const imagePickerRef = React.useRef<HTMLInputElement | null>(null);

    const [openPhotoLibrary, setOpenPhotoLibrary] = React.useState(false);
    const [openTakePhoto, setOpenTakePhoto] = React.useState(false);

    const resetContextClick = () => {
      setImageFile?.(undefined);
      !!imagePickerRef.current && (imagePickerRef.current.value = "");
      setOpenTakePhoto(false);
      setOpenPhotoLibrary(false);
    };

    const closePopup = () => {
      setOpenPhotoLibrary(false);
      setOpenTakePhoto(false);
      setIsContextVisible(false);
    };

    const showContextMenu = (
      e: React.MouseEvent<HTMLLabelElement | SVGElement, MouseEvent>,
    ) => {
      e.preventDefault();
      setContextCoordinates({ x: e.pageX, y: e.pageY });
      setIsContextVisible(true);
    };

    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-full",
          size === "sm" && "size-10",
          size === "md" && "size-12",
          size === "lg" && "size-14",
          size === "xl" && "size-36",
          size === "2xl" && "size-40",
          imageContainerClassName,
        )}
      >
        <Image
          ref={ref}
          src={!!imageFile ? URL.createObjectURL(imageFile) : src}
          alt="avatar"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn("h-full w-full object-cover object-top", className)}
          fill
        />

        {size === "xl" && (
          <label
            className="absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center transition-colors duration-300 group-hover/image:bg-primary/80"
            id={contextIdentifier}
            onClick={showContextMenu}
          >
            <FaCamera
              className="size-8 opacity-0 transition-opacity duration-300 group-hover/image:opacity-100"
              id={contextIdentifier}
              onClick={showContextMenu}
            />
          </label>
        )}

        {isContextVisible && (
          <ContextMenu
            options={[
              { name: "Take Photo", callback: () => setOpenTakePhoto(true) },
              {
                name: "Choose From Library",
                callback: () => setOpenPhotoLibrary(true),
              },
              {
                name: "Upload Photo",
                callback: () => imagePickerRef.current?.click(),
              },
              {
                name: "Remove Photo",
                callback: () => setImage?.(defaultAvatar),
              },
            ]}
            coordinates={{ x: contextCoordinates.x, y: contextCoordinates.y }}
            closeContextMenu={() => setIsContextVisible(false)}
            contextIdentifier={contextIdentifier}
            resetFunction={resetContextClick}
          />
        )}

        <input
          type="file"
          accept="image/*"
          ref={imagePickerRef}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setImageFile?.(e.target.files[0]);
            }
          }}
        />

        {!!setImageFile && openTakePhoto && (
          <TakePhoto
            setImageFile={setImageFile}
            closePhotoLibrary={closePopup}
          />
        )}
        {!!setImageFile && openPhotoLibrary && (
          <PhotoLibrary
            setImageFile={setImageFile}
            closePhotoLibrary={closePopup}
          />
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

export default Avatar;
