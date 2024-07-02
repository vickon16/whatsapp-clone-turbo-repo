import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils";

type Props = {
  isContactSearch?: boolean;
};

function SearchBar({ isContactSearch }: Props) {
  return (
    <section
      className={cn(
        "flex h-14 w-full items-center gap-3 rounded-md bg-primary/50 py-3",
        { "px-4": !isContactSearch },
      )}
    >
      <div className="flex flex-grow items-center rounded-lg bg-background px-3 py-1">
        <BiSearchAlt2
          className="size-4 cursor-pointer text-link"
          title="Search"
        />
        <Input
          type="text"
          name=""
          placeholder={
            isContactSearch
              ? "Search Contacts..."
              : "Search or start a new chat"
          }
          className="h-0 w-full border-none bg-transparent py-4 text-sm text-white"
        />
      </div>

      {!isContactSearch && (
        <BsFilter
          className="mx-1 size-5 shrink-0 cursor-pointer text-link"
          title="Filter"
        />
      )}
    </section>
  );
}

export default SearchBar;
