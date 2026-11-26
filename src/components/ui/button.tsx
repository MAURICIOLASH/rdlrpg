import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "rdl-button inline-flex items-center justify-center gap-2 whitespace-normal leading-snug [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
        outline: "rdl-button-secondary",
        secondary: "rdl-button-secondary",
        ghost: "rdl-button-secondary",
        link: "rdl-button-secondary rdl-button-compact",
      },
      size: {
        default: "min-h-9 px-4 py-2",
        sm: "rdl-button-compact text-xs",
        lg: "min-h-10 px-8 py-3",
        icon: "rdl-button-icon h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
