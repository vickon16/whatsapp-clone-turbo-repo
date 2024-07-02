import { cn } from "@/utils";
import React, { useEffect, useRef } from "react";

export type TContextOption = { name: string; callback: () => void };

type ContextMenuProps = {
  className?: string;
  contextIdentifier: string;
  options: TContextOption[];
  coordinates: { x: number; y: number };
  closeContextMenu: () => void;
  resetFunction?: () => void;
};

const ContextMenu = ({
  className,
  options,
  coordinates,
  closeContextMenu,
  contextIdentifier,
  resetFunction,
}: ContextMenuProps) => {
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const handleClick = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    callback: () => void,
  ) => {
    e.stopPropagation();
    callback();
    closeContextMenu();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as (Node & { id?: string }) | null;
      if (target?.id === contextIdentifier) return;
      if (contextMenuRef?.current && !contextMenuRef.current.contains(target)) {
        closeContextMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenuRef, closeContextMenu, contextIdentifier]);

  return (
    <div
      ref={contextMenuRef}
      className={cn(
        "fixed z-[100]  rounded-md bg-primary py-3  shadow-lg sm:min-w-[200px]",
        className,
      )}
      style={{
        top: coordinates.y,
        left: coordinates.x,
      }}
    >
      <h5 className="px-3 py-1.5 text-xs text-muted-foreground">Options</h5>
      <div className="h-[2px] w-full bg-muted" />

      <ul className="p-2">
        {options.map(({ name, callback }, index) => (
          <li
            key={name + index}
            onClick={(e) => {
              !!resetFunction && resetFunction();
              handleClick(e, callback);
            }}
            className="cursor-pointer px-3 py-2 text-xs hover:bg-muted/70"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
