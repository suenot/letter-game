import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  className?: string;
  text?: string;
}

export function Loading({ className = "", text = "Loading..." }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className="h-4 w-4 animate-spin" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function LoadingFull({ className = "", text = "Loading..." }: LoadingProps) {
  return (
    <div className={`flex h-[50vh] w-full items-center justify-center ${className}`}>
      <Loading text={text} />
    </div>
  );
}
