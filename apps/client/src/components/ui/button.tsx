import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils";
import { LuLoader2 } from "react-icons/lu";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default: "bg-primary/90 hover:bg-primary/80 text-primary-foreground",
        outline:
          "bg-transparent border border-border/80 hover:border-border/90 text-foreground",
      },
      size: {
        default: "h-9 px-5 py-3",
        sm: "h-8 px-3",
        lg: "h-11 px-6 text-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      children,
      isLoading,
      disabled,
      icon: Icon,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(
          "flex items-center gap-1",
          buttonVariants({ variant, size, className }),
        )}
        ref={ref}
        disabled={disabled ?? isLoading ?? false}
        {...props}
      >
        {!!isLoading && <LuLoader2 className="h-4 w-4 animate-spin" />}
        {!!Icon && Icon}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
