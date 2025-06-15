import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base
        "flex min-h-16 w-full rounded-md bg-transparent px-3 py-2 text-base md:text-sm shadow-xs outline-none transition-[color,box-shadow]",

        // Sizing & Layout
        "field-sizing-content",

        // Border & Theme
        "border border-cyan-400/10 dark:bg-input/30",

        // Placeholder
        "placeholder:text-cyan-200/60",

        // 👉 Hover effects
        "hover:bg-cyan-400/5 hover:border-cyan-400/30",

        // 👉 Focus effects
        "focus-visible:ring-1 focus-visible:ring-cyan-400/40 focus-visible:ring-offset-0 focus-visible:border-cyan-400/40",

        // Error/disabled states
        "aria-invalid:border-red-400 aria-invalid:ring-red-400/20 dark:aria-invalid:ring-red-400/40",
        "disabled:cursor-not-allowed disabled:opacity-50",

        className
      )}
      {...props}
    />
  );
}

export { Textarea }
