import { Loader2 } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "./ui/button";

export interface SubmitButtonProps {
  className?: string;
  submitting: boolean;
  label: string;
  loadingLabel: string;
}

export function SubmitButton({
  label,
  submitting: loading = false,
  className = "",
  loadingLabel = "",
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={cn("flex items-center justify-center gap-x-2", className)}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <span>{label}</span>
      )}
    </Button>
  );
}
