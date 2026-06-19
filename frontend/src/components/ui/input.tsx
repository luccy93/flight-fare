import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-4 py-2 text-sm",
            "text-secondary-900 dark:text-secondary-100",
            "placeholder:text-secondary-400 dark:placeholder:text-secondary-500",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 dark:focus:border-primary-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
            "hover:border-secondary-300 dark:hover:border-secondary-600",
            error && "border-danger-500 focus:ring-danger-500/30 focus:border-danger-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-danger-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
