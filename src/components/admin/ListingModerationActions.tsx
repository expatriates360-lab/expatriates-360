"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { LISTING_CATEGORIES, LISTING_CATEGORY_COLORS } from "@/lib/constants";
import type { ListingWithSeller } from "@/types/database";

interface ListingModerationActionsProps {
  listingId: string;
  currentStatus: string;
  listing: ListingWithSeller;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

export function ListingModerationActions({
  listingId,
  currentStatus,
  listing,
}: ListingModerationActionsProps) {
  const seller = listing.profiles;
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [open, setOpen] = useState(false);

  const catLabel =
    LISTING_CATEGORIES.find((c) => c.value === listing.category)?.label ??
    listing.category;
  const catColor =
    LISTING_CATEGORY_COLORS[listing.category] ?? "bg-muted text-muted-foreground";

  async function updateStatus(newStatus: "approved" | "rejected") {
    setLoading(newStatus === "approved" ? "approve" : "reject");
    try {
      const res = await fetch(`/api/market/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setStatus(newStatus);
      toast.success(`Listing ${newStatus}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      {/* ── Actions row ── */}
      <div className="flex items-center gap-2">
        <Badge className={`text-xs border ${STATUS_COLORS[status] ?? ""}`}>{status}</Badge>

        {/* View Details */}
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setOpen(true)}
          title="View details"
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>

        {status !== "approved" && (
          <Button
            size="sm"
            className="h-7 text-xs px-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => updateStatus("approved")}
            disabled={loading !== null}
          >
            {loading === "approve" ? "…" : "Approve"}
          </Button>
        )}
        {status !== "rejected" && (
          <Button
            variant="destructive"
            size="sm"
            className="h-7 text-xs px-2"
            onClick={() => updateStatus("rejected")}
            disabled={loading !== null}
          >
            {loading === "reject" ? "…" : "Reject"}
          </Button>
        )}
      </div>

      {/* ── View Details Dialog ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold leading-tight pr-8">
              {listing.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-2">
            {/* Image */}
            {listing.image_url && (
              <div className="w-full rounded-xl overflow-hidden border border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="w-full h-auto object-contain"
                />
              </div>
            )}

            {/* Price + Category */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold text-primary">
                {listing.currency} {listing.price}
              </span>
              <Badge className={`text-xs border-0 ${catColor}`}>{catLabel}</Badge>
              <Badge className={`text-xs border ${STATUS_COLORS[status] ?? ""}`}>{status}</Badge>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {listing.location && (
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Location</p>
                  <p className="text-foreground">{listing.location}</p>
                </div>
              )}
              {listing.contact_phone && (
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Contact Phone</p>
                  <p className="text-foreground font-mono">{listing.contact_phone}</p>
                </div>
              )}
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Submitted</p>
                <p className="text-foreground">
                  {new Date(listing.created_at).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Seller</p>
                {seller ? (
                  <>
                    <p className="text-foreground font-medium">{seller.full_name}</p>
                    {seller.username && (
                      <p className="text-xs text-muted-foreground">@{seller.username}</p>
                    )}
                  </>
                ) : (
                  <p className="text-foreground font-mono text-xs truncate">{listing.seller_id}</p>
                )}
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Description</p>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted/40 rounded-lg p-4">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Footer actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              {status !== "approved" && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => { updateStatus("approved"); setOpen(false); }}
                  disabled={loading !== null}
                >
                  {loading === "approve" ? "Approving…" : "Approve"}
                </Button>
              )}
              {status !== "rejected" && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => { updateStatus("rejected"); setOpen(false); }}
                  disabled={loading !== null}
                >
                  {loading === "reject" ? "Rejecting…" : "Reject"}
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
