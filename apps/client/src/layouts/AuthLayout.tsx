import { cn } from "@/utils";
import Image from "next/image";

type Props = {
  children: React.ReactNode;
  smallHeader?: boolean;
};

const AuthLayout = ({ children, smallHeader }: Props) => {
  return (
    <section className="flex h-screen w-screen flex-col items-center justify-center gap-8 p-4">
      <div className="flex flex-col items-center justify-center gap-2 text-foreground sm:flex-row">
        <div
          className={cn("relative aspect-square h-[100px] ", {
            "h-[150px] sm:h-[200px] md:h-[250px]": !smallHeader,
          })}
        >
          <Image
            src="/whatsapp.gif"
            alt="whatsapp"
            fill
            className="h-full w-full object-contain"
          />
        </div>
        <span
          className={cn("text-clampBase", {
            "text-clamp2Xl": !smallHeader,
          })}
        >
          WhatsApp
        </span>
      </div>

      {children}
    </section>
  );
};

export default AuthLayout;
