import Image from "next/image";

function Empty() {
  return (
    <aside className="flex h-screen w-full flex-col items-center  justify-center gap-y-4 border-b-4 border-conversation/50 border-b-emerald-400 bg-background">
      <div className="relative aspect-square h-[150px] sm:h-[200px]">
        <Image
          src="/whatsapp.gif"
          alt="whatsapp"
          fill
          className="h-full w-full object-contain"
        />
      </div>
      <p className="text-muted-foreground">
        Create a Chat with any of your contacts
      </p>
    </aside>
  );
}

export default Empty;
