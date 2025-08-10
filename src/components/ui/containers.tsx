import { cn } from "@/lib/utils";
import React from "react";

const LandingContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, id, children }, ref) => (
  <div
    id={id}
    ref={ref}
    className={cn("px-4 md:px-6 max-w-[1400px] mx-auto", className)}
  >
    {children}
  </div>
));
LandingContainer.displayName = "LandingContainer";

export { LandingContainer };
