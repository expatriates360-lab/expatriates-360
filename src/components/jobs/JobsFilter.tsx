"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
import { useCallback, useState } from "react";
import { LOCATIONS } from "@/lib/constants";

export function JobsFilter({
  defaultSearch,
  defaultCategory,
  defaultLocation,
  categories,
}: {
  defaultSearch: string;
  defaultCategory: string;
  defaultLocation: string;
  categories: string[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState(defaultSearch);
  const [category, setCategory] = useState(defaultCategory);
  const [location, setLocation] = useState(defaultLocation);

  const apply = useCallback(
    (s: string, c: string, l: string) => {
      const params = new URLSearchParams();
      if (s) params.set("search", s);
      if (c) params.set("category", c);
      if (l) params.set("location", l);
      router.push(`/jobs?${params.toString()}`);
    },
    [router]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") apply(search, category, location);
          }}
          className="pl-9"
        />
      </div>
      <Select
        value={category}
        onValueChange={(v: string | null) => {
          const val = v ?? "";
          setCategory(val);
          apply(search, val, location);
        }}
      >
        <SelectTrigger className="sm:w-[180px] cursor-pointer">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="" className="cursor-pointer">All categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c} value={c} className="cursor-pointer">
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={location}
        onValueChange={(v: string | null) => {
          const val = v ?? "";
          setLocation(val);
          apply(search, category, val);
        }}
      >
        <SelectTrigger className="sm:w-[160px] cursor-pointer">
          <SelectValue placeholder="All locations"  />
        </SelectTrigger>
        <SelectContent >
          <SelectItem value="" className="cursor-pointer" >All locations</SelectItem>
          {LOCATIONS.map((l) => (
            <SelectItem key={l} value={l} className="cursor-pointer">
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        onClick={() => apply(search, category, location)}
        className="sm:w-auto cursor-pointer"
      >
        Search
      </Button>
      {(search || category || location) && (
        <Button
          variant="ghost"
          onClick={() => {
            setSearch("");
            setCategory("");
            setLocation("");
            router.push("/jobs");
          }}
          className="sm:w-auto cursor-pointer"
        >
          Clear
        </Button>
      )}
    </div>
  );
}
