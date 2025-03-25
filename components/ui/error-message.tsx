import { ApiError } from "@/src/api";
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { XCircle } from "lucide-react";

interface ErrorMessageProps {
  error: ApiError | null;
  className?: string;
}

export function ErrorMessage({ error, className }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <Alert variant="destructive" className={className}>
      <XCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {String(error.message)}
        {error.details && (
          <details className="mt-2 text-sm">
            <summary>Details</summary>
            <pre className="mt-2 whitespace-pre-wrap">
              {typeof error.details === 'object' 
                ? JSON.stringify(error.details, null, 2)
                : String(error.details)}
            </pre>
          </details>
        )}
      </AlertDescription>
    </Alert>
  );
}
