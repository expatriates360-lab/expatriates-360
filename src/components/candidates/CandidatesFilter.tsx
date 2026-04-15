"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import { PROFESSIONS, LOCATIONS } from "@/lib/constants";

export function CandidatesFilter({
  defaultSearch,
  defaultProfession,
  defaultLocation,
}: {
  defaultSearch: string;
  defaultProfession: string;
  defaultLocation: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(defaultSearch);
  const [profession, setProfession] = useState(defaultProfession);
  const [location, setLocation] = useState(defaultLocation);

  const apply = useCallback(
    (s: string, p: string, l: string) => {
      const params = new URLSearchParams();
      if (s) params.set("search", s);
      if (p) params.set("profession", p);
      if (l) params.set("location", l);
      router.push(`/candidates?${params.toString()}`);
    },
    [router]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search candidates…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") apply(search, profession, location);
          }}
          className="pl-9"
        />
      </div>
      <Select
        value={profession}
        onValueChange={(v: string | null) => {
          const val = v ?? "";
          setProfession(val);
          apply(search, val, location);
        }}
      >
        <SelectTrigger className="sm:w-[200px] cursor-pointer">
          <SelectValue placeholder="All professions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="" className="cursor-pointer">All professions</SelectItem>
          {PROFESSIONS.map((p) => (
            <SelectItem key={p} value={p} className="cursor-pointer">
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={location}
        onValueChange={(v: string | null) => {
          const val = v ?? "";
          setLocation(val);
          apply(search, profession, val);
        }}
      >
        <SelectTrigger className="sm:w-[160px] cursor-pointer">
          <SelectValue placeholder="All locations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="" className="cursor-pointer">All locations</SelectItem>
          {LOCATIONS.map((l) => (
            <SelectItem key={l} value={l} className="cursor-pointer">
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        onClick={() => apply(search, profession, location)}
        className="sm:w-auto cursor-pointer"
      >
        Search
      </Button>
      {(search || profession || location) && (
        <Button
          variant="ghost"
          onClick={() => {
            setSearch("");
            setProfession("");
            setLocation("");
            router.push("/candidates");
          }}
          className="sm:w-auto cursor-pointer"
        >
          Clear
        </Button>
      )}
    </div>
  );
}
