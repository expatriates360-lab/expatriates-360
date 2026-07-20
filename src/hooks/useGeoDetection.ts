"use client";

import { useEffect, useState } from "react";
import { getCurrencyForCountry } from "@/lib/countries";

export interface GeoLocation {
  countryCode: string | null;
  countryName: string | null;
  city: string | null;
  currency: string | null;
  loading: boolean;
  error: boolean;
}

const STORAGE_KEY = "hunared_geo_detection";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours — avoid re-hitting the API every page load

/**
 * Detects the visitor's country, city, and currency via IP geolocation.
 * Uses ipapi.co (free tier, no API key required for reasonable usage).
 * Caches result in localStorage for 24h to reduce API calls and speed up repeat visits.
 * Fails silently — geo detection is a convenience feature, never blocks the UI.
 */
export function useGeoDetection(): GeoLocation {
  const [geo, setGeo] = useState<GeoLocation>({
    countryCode: null,
    countryName: null,
    city: null,
    currency: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function detect() {
      // Check cache first
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as GeoLocation & { timestamp: number };
          if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            if (!cancelled) setGeo({ ...parsed, loading: false });
            return;
          }
        }
      } catch {
        // ignore cache errors, fall through to live fetch
      }

      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("Geo lookup failed");
        const data = await res.json();

        const result: GeoLocation = {
          countryCode: data.country_code ?? null,
          countryName: data.country_name ?? null,
          city: data.city ?? null,
          currency: data.country_code ? getCurrencyForCountry(data.country_code) : null,
          loading: false,
          error: false,
        };

        if (!cancelled) {
          setGeo(result);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...result, timestamp: Date.now() }));
          } catch {
            // localStorage may be unavailable (private browsing) — safe to ignore
          }
        }
      } catch {
        if (!cancelled) {
          setGeo((prev) => ({ ...prev, loading: false, error: true }));
        }
      }
    }

    detect();
    return () => {
      cancelled = true;
    };
  }, []);

  return geo;
}
