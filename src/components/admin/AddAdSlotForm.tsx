"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { upsertAdPlacement } from "@/app/(dashboard)/dashboard/admin/ads/actions";
import type { AdType } from "@/types/database";

const SUGGESTED_SLOTS = [
  "header",
  "homepage_hero",
  "homepage_mid",
  "job_sidebar",
  "job_below_description",
  "blog_sidebar",
  "market_top",
];

export function AddAdSlotForm() {
  const [open, setOpen] = useState(false);
  const [slotName, setSlotName] = useState("");
  const [adType, setAdType] = useState<AdType>("adsense");
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    const name = slotName.trim().toLowerCase().replace(/\s+/g, "_");
    if (!name) {
      toast.error("Slot name is required.");
      return;
    }
    startTransition(async () => {
      try {
        await upsertAdPlacement({
          slot_name: name,
          is_active: false,
          ad_type: adType,
          custom_image_url: "",
          custom_redirect_url: "",
          adsense_slot_id: "",
        });
        toast.success(`Slot "${name}" created.`);
        setSlotName("");
        setOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to create slot");
      }
    });
  }

  if (!open) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="gap-1.5 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" /> Add Slot
      </Button>
    );
  }

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">New Ad Slot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Slot Name</Label>
          <Input
            className="h-8 text-xs"
            placeholder="e.g. header, job_sidebar"
            list="slot-suggestions"
            value={slotName}
            onChange={(e) => setSlotName(e.target.value)}
          />
          <datalist id="slot-suggestions">
            {SUGGESTED_SLOTS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <p className="text-[10px] text-muted-foreground">
            Use lowercase with underscores. Must match the slotName prop in your code.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Ad Type</Label>
          <Select value={adType} onValueChange={(v) => setAdType(v as AdType)}>
            <SelectTrigger className="h-8 text-xs cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer text-xs" value="adsense">Google AdSense</SelectItem>
              <SelectItem className="cursor-pointer text-xs" value="custom">Custom Banner</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 justify-end pt-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-7 text-xs cursor-pointer"
            onClick={handleAdd}
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" /> Creating…
              </span>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
