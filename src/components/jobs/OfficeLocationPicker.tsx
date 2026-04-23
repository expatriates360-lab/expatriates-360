"use client";

import { useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEFAULT_CENTER = { lat: 24.7136, lng: 46.6753 }; // Riyadh, Saudi Arabia

export interface OfficeLocation {
  lat: number;
  lng: number;
  address: string;
}

interface OfficeLocationPickerProps {
  value: OfficeLocation | null;
  onChange: (v: OfficeLocation) => void;
}

// ── Regex patterns for extracting lat/lng from long Google Maps URLs ──────────
const PATTERNS = [
  /@(-?\d+\.\d+),(-?\d+\.\d+)/,          // @lat,lng
  /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,    // ?q=lat,lng
  /\/(-?\d+\.\d+),(-?\d+\.\d+)/,         // /lat,lng
  /ll=(-?\d+\.\d+),(-?\d+\.\d+)/,        // ll=lat,lng
];

function extractCoords(url: string): { lat: number; lng: number } | null {
  for (const pattern of PATTERNS) {
    const m = url.match(pattern);
    if (m) {
      const lat = parseFloat(m[1]);
      const lng = parseFloat(m[2]);
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    }
  }
  return null;
}

function isShortUrl(url: string) {
  return url.startsWith("https://maps.app.goo.gl/") || url.startsWith("https://goo.gl/maps/");
}

export function OfficeLocationPicker({ value, onChange }: OfficeLocationPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: apiKey });

  const [center, setCenter] = useState<{ lat: number; lng: number }>(
    value ? { lat: value.lat, lng: value.lng } : DEFAULT_CENTER
  );
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(
    value ? { lat: value.lat, lng: value.lng } : null
  );
  const [urlInput, setUrlInput] = useState(value?.address ?? "");
  const [isResolving, setIsResolving] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const reverseGeocode = useCallback(
    (lat: number, lng: number) => {
      if (!geocoderRef.current) {
        geocoderRef.current = new google.maps.Geocoder();
      }
      geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
        const address =
          status === "OK" && results?.[0]
            ? results[0].formatted_address
            : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        onChange({ lat, lng, address });
      });
    },
    [onChange]
  );

  const pinCoords = useCallback(
    (lat: number, lng: number) => {
      setCenter({ lat, lng });
      setMarkerPos({ lat, lng });
      reverseGeocode(lat, lng);
    },
    [reverseGeocode]
  );

  const handleUrlChange = useCallback(
    async (raw: string) => {
      setUrlInput(raw);
      setUrlError(null);
      const trimmed = raw.trim();
      if (!trimmed) return;

      // Short URL — resolve on the server first
      if (isShortUrl(trimmed)) {
        setIsResolving(true);
        try {
          const res = await fetch(`/api/maps/expand?url=${encodeURIComponent(trimmed)}`);
          const data = await res.json();
          if (!res.ok || !data.expanded) throw new Error(data.error ?? "Could not resolve URL");
          const coords = extractCoords(data.expanded);
          if (!coords) throw new Error("No coordinates found in resolved URL");
          pinCoords(coords.lat, coords.lng);
        } catch (err) {
          setUrlError(err instanceof Error ? err.message : "Failed to resolve URL");
        } finally {
          setIsResolving(false);
        }
        return;
      }

      // Long URL — parse directly
      const coords = extractCoords(trimmed);
      if (coords) {
        pinCoords(coords.lat, coords.lng);
      } else if (trimmed.includes("google.com/maps") || trimmed.includes("maps.google")) {
        setUrlError("Couldn't extract coordinates from this URL. Try clicking the map manually.");
      }
    },
    [pinCoords]
  );

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      pinCoords(e.latLng.lat(), e.latLng.lng());
    },
    [pinCoords]
  );

  const onMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      pinCoords(e.latLng.lat(), e.latLng.lng());
    },
    [pinCoords]
  );

  if (!apiKey) {
    return (
      <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-dashed border-border text-muted-foreground text-sm">
        <MapPin className="h-4 w-4 shrink-0" />
        <span>Set <code className="text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable map picker.</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="text-destructive text-sm p-3 rounded-lg border border-destructive/30 bg-destructive/5">
        Failed to load Google Maps. Check your API key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-52 rounded-lg border border-border bg-muted flex items-center justify-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading map...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Paste Google Maps URL (Optional)</Label>
        <div className="relative">
          <Input
            type="url"
            placeholder="https://maps.app.goo.gl/... or paste a long Google Maps link"
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
            className={urlError ? "border-destructive" : ""}
            disabled={isResolving}
          />
          {isResolving && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        {urlError && <p className="text-xs text-destructive">{urlError}</p>}
        {!urlError && (
          <p className="text-xs text-muted-foreground">Or click directly on the map to place the pin manually.</p>
        )}
      </div>

      <GoogleMap
        mapContainerClassName="w-full rounded-lg border border-border overflow-hidden"
        mapContainerStyle={{ height: "220px" }}
        center={center}
        zoom={markerPos ? 14 : 5}
        options={{ disableDefaultUI: true, zoomControl: true, clickableIcons: false }}
        onClick={onMapClick}
      >
        {markerPos && (
          <Marker position={markerPos} draggable onDragEnd={onMarkerDragEnd} />
        )}
      </GoogleMap>

      {value?.address && (
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          {value.address}
        </p>
      )}
    </div>
  );
}
import { Input } from "@/components/ui/input";

const LIBRARIES: ("places")[] = ["places"];
const DEFAULT_CENTER = { lat: 24.7136, lng: 46.6753 }; // Riyadh, Saudi Arabia

export interface OfficeLocation {
  lat: number;
  lng: number;
  address: string;
}

interface OfficeLocationPickerProps {
  value: OfficeLocation | null;
  onChange: (v: OfficeLocation) => void;
}

export function OfficeLocationPicker({
  value,
  onChange,
}: OfficeLocationPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  });

  const [center, setCenter] = useState<{ lat: number; lng: number }>(
    value ? { lat: value.lat, lng: value.lng } : DEFAULT_CENTER
  );
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(
    value ? { lat: value.lat, lng: value.lng } : null
  );

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const reverseGeocode = useCallback(
    (lat: number, lng: number) => {
      if (!geocoderRef.current) {
        geocoderRef.current = new google.maps.Geocoder();
      }
      geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
        const address =
          status === "OK" && results?.[0]
            ? results[0].formatted_address
            : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        onChange({ lat, lng, address });
      });
    },
    [onChange]
  );

  const onPlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.geometry?.location) return;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address ?? place.name ?? "";
    setCenter({ lat, lng });
    setMarkerPos({ lat, lng });
    onChange({ lat, lng, address });
  }, [onChange]);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPos({ lat, lng });
      reverseGeocode(lat, lng);
    },
    [reverseGeocode]
  );

  const onMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPos({ lat, lng });
      reverseGeocode(lat, lng);
    },
    [reverseGeocode]
  );

  if (!apiKey) {
    return (
      <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-dashed border-border text-muted-foreground text-sm">
        <MapPin className="h-4 w-4 shrink-0" />
        <span>Set <code className="text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable map picker.</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="text-destructive text-sm p-3 rounded-lg border border-destructive/30 bg-destructive/5">
        Failed to load Google Maps. Check your API key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-52 rounded-lg border border-border bg-muted flex items-center justify-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading map...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Autocomplete
        onLoad={(a) => {
          autocompleteRef.current = a;
        }}
        onPlaceChanged={onPlaceChanged}
      >
        <Input
          type="text"
          placeholder="Search address or click on the map to pin..."
          defaultValue={value?.address ?? ""}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerClassName="w-full rounded-lg border border-border overflow-hidden"
        mapContainerStyle={{ height: "220px" }}
        center={center}
        zoom={markerPos ? 14 : 5}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
        }}
        onClick={onMapClick}
      >
        {markerPos && (
          <Marker
            position={markerPos}
            draggable
            onDragEnd={onMarkerDragEnd}
          />
        )}
      </GoogleMap>

      {value?.address && (
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          {value.address}
        </p>
      )}
    </div>
  );
}
