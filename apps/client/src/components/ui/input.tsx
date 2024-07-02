import * as React from "react";

import { cn } from "@/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: boolean;
  labelClassName?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, name, type = "text", label, labelClassName, ...props },
    ref,
  ) => {
    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label
            htmlFor={name}
            className={cn(
              "px-1 text-clampMd capitalize text-teal-400",
              labelClassName,
            )}
          >
            {name}
          </label>
        )}
        <input
          id={name}
          type={type}
          name={name}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
