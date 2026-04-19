"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Archive, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface JobRowActionsProps {
  jobId: string;
  jobStatus: string;
}

export function JobRowActions({ jobId, jobStatus }: JobRowActionsProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);
  const isClosed = jobStatus === "closed";

  async function handleClose() {
    setIsClosing(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to close job");
      }
      toast.success("Job marked as closed.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsClosing(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      {/* Edit */}
      <Link
        href={`/dashboard/jobs/${jobId}/edit`}
        aria-label="Edit job"
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <Pencil className="h-4 w-4" />
      </Link>

      {/* Close / Mark as Filled */}
      {!isClosed && (
        <AlertDialog>
          <AlertDialogTrigger
            className={buttonVariants({ variant: "ghost", size: "icon" }) + " text-muted-foreground hover:text-amber-600 transition-colors duration-200 cursor-pointer"}
            aria-label="Close job"
            disabled={isClosing}
          >
            {isClosing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Archive className="h-4 w-4" />
            )}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Mark job as closed?</AlertDialogTitle>
              <AlertDialogDescription>
                This will hide the job from public listings. You can reopen it
                by contacting support or editing the post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClose} className="cursor-pointer">
                Mark as Closed
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
