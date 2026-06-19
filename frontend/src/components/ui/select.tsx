import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-11 w-full rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-4 py-2 pr-10 text-sm",
            "text-secondary-900 dark:text-secondary-100",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 dark:focus:border-primary-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "appearance-none transition-all duration-200",
            "hover:border-secondary-300 dark:hover:border-secondary-600",
            error && "border-danger-500 focus:ring-danger-500/30 focus:border-danger-500",
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400 pointer-events-none transition-transform group-focus-within:rotate-180" />
        {error && (
          <p className="mt-1.5 text-xs text-danger-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
