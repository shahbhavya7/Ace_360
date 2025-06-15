import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
className={cn(
  "file:text-foreground placeholder:text-[rgb(147_251_253_/_0.6)] selection:bg-primary selection:text-primary-foreground",
  "dark:bg-input/30 border border-cyan-400/10 flex h-9 w-full min-w-0 rounded-md bg-transparent px-3 py-1 text-base shadow-xs transition-[background,border,color,box-shadow] outline-none",
  "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  // 👉 Focus ring override
  "focus-visible:ring-1 focus-visible:ring-cyan-400/40 focus-visible:ring-offset-0 focus-visible:border-cyan-400/40",
  // 👉 Invalid state override
  "aria-invalid:ring-red-400/40 aria-invalid:border-red-400",
  // 👉 Improved hover visibility
  "hover:bg-cyan-400/5 hover:border-cyan-400/30",

  className
)}
      {...props} />
  );
}

export { Input }
