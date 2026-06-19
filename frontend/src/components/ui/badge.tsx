import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm shadow-primary-500/20",
        secondary:
          "border-secondary-200 dark:border-secondary-700 bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300",
        destructive:
          "border-transparent bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-sm shadow-danger-500/20",
        outline:
          "border-secondary-300 dark:border-secondary-600 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800/50",
        success:
          "border-transparent bg-gradient-to-r from-success-500 to-success-600 text-white shadow-sm shadow-success-500/20",
        warning:
          "border-transparent bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-sm shadow-warning-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
