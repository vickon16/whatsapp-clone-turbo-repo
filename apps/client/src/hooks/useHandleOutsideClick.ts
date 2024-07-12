import { useEffect } from "react";

const useHandleOutsideClick = ({
  contextIdentifier,
  contextRef,
  callBack,
}: {
  contextIdentifier: string;
  contextRef: React.MutableRefObject<HTMLDivElement | null>;
  callBack: () => void;
}) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as (Node & { id?: string }) | null;
      if (target?.id === contextIdentifier) return;
      if (contextRef?.current && !contextRef.current.contains(target)) {
        callBack();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextRef, contextIdentifier]);
};

export default useHandleOutsideClick;
