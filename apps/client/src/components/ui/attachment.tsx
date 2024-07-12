import { cn } from "@/utils";
import { iconStyle } from "@/utils/constants";
import * as React from "react";
import { ImAttachment } from "react-icons/im";

type AttachmentProps = React.HTMLAttributes<HTMLDivElement> & {
  // imageFile: File | undefined;
  setImageFile: (file: File | undefined) => void;
};

const Attachment = React.forwardRef<HTMLImageElement, AttachmentProps>(
  ({ className, setImageFile }, ref) => {
    return (
      <div ref={ref} className={cn("", className)}>
        <label htmlFor="open-attachment">
          <ImAttachment className={iconStyle} title="Attach File" />
        </label>
        <input
          type="file"
          accept="image/*"
          id="open-attachment"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setImageFile(e.target.files[0]);
            }
          }}
        />
      </div>
    );
  },
);

Attachment.displayName = "Attachment";

export default Attachment;
