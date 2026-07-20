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
import { PROFESSIONS } from "@/lib/constants";

export function CandidatesFilter({
  defaultSearch,
  defaultProfession,
}: {
  defaultSearch: string;
  defaultProfession: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(defaultSearch);
  const [profession, setProfession] = useState(defaultProfession);

  const apply = useCallback(
    (s: string, p: string) => {
      const params = new URLSearchParams();

      if (s) params.set("search", s);
      if (p) params.set("profession", p);

      router.push(`/candidates?${params.toString()}`);
    },
    [router]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search candidates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") apply(search, profession);
          }}
          className="pl-9"
        />
      </div>

      <Select
        value={profession}
        onValueChange={(v: any) => {
          setProfession(v);
          apply(search, v);
        }}
      >
        <SelectTrigger className="sm:w-[200px] cursor-pointer">
          <SelectValue placeholder="All professions" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all" className="cursor-pointer">
            All professions
          </SelectItem>

          {PROFESSIONS.map((p) => (
            <SelectItem key={p} value={p} className="cursor-pointer">
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => apply(search, profession)}
        className="cursor-pointer"
      >
        Search
      </Button>

      {(search || (profession && profession !== "all")) && (
        <Button
          variant="ghost"
          onClick={() => {
            setSearch("");
            setProfession("all");
            router.push("/candidates");
          }}
          className="cursor-pointer"
        >
          Clear
        </Button>
      )}
    </div>
  );
}
