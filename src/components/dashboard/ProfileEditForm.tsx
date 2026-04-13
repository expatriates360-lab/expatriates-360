"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Upload, X, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import { LOCATIONS, PROFESSIONS } from "@/lib/constants";
import type { Profile } from "@/types/database";

export function ProfileEditForm({ initialProfile }: { initialProfile: Profile }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [fullName, setFullName] = useState(initialProfile.full_name ?? "");
  const [username, setUsername] = useState(initialProfile.username ?? "");
  const [phone, setPhone] = useState(initialProfile.phone ?? "");
  const [gender, setGender] = useState(initialProfile.gender ?? "");
  const [location, setLocation] = useState(initialProfile.location ?? "");
  const [profession, setProfession] = useState(initialProfile.profession ?? "");
  const [companyCr, setCompanyCr] = useState(initialProfile.company_cr ?? "");
  const [companyWebsite, setCompanyWebsite] = useState(
    initialProfile.company_website ?? ""
  );
  const [companyAddress, setCompanyAddress] = useState(
    initialProfile.company_address ?? ""
  );

  const [avatarPreview, setAvatarPreview] = useState(
    initialProfile.avatar_url ?? ""
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const isSeeker = initialProfile.role === "seeker";

  async function handleSave() {
    if (!fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }
    setIsLoading(true);
    try {
      let avatarUrl = initialProfile.avatar_url;
      let avatarPublicId = initialProfile.avatar_public_id;
      let cvUrl = initialProfile.cv_url;

      if (avatarFile) {
        const { url, publicId } = await uploadToCloudinary(
          avatarFile,
          "expatriates360/avatars"
        );
        avatarUrl = url;
        avatarPublicId = publicId;
      }

      if (cvFile && isSeeker) {
        const fd = new FormData();
        fd.append("cv", cvFile);
        const res = await fetch("/api/profile/upload-cv", {
          method: "POST",
          body: fd,
        });
        if (!res.ok) throw new Error("CV upload failed");
        const data = (await res.json()) as { path: string };
        cvUrl = data.path;
      }

      const res = await fetch("/api/profile/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: initialProfile.role,
          fullName: fullName.trim(),
          username: username.trim() || null,
          phone: phone.trim() || null,
          gender: gender || null,
          location: location || null,
          profession: isSeeker ? (profession || null) : null,
          avatarUrl,
          avatarPublicId,
          cvUrl,
          companyCr: !isSeeker ? (companyCr.trim() || null) : null,
          companyWebsite: !isSeeker ? (companyWebsite.trim() || null) : null,
          companyAddress: !isSeeker ? (companyAddress.trim() || null) : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save profile");
      toast.success("Profile updated successfully.");
      router.refresh();
    } catch (err: unknown) {
      toast.error((err as Error)?.message ?? "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {isSeeker ? "My Profile" : "Company Profile"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Keep your information up to date to improve visibility.
        </p>
      </div>

      {/* Avatar */}
      <div className="w-full flex items-center gap-5 p-5 rounded-xl border border-border bg-card">
        <div className="relative shrink-0">
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarPreview}
              alt="Avatar"
              className="h-20 w-20 rounded-full object-cover border-2 border-primary/20"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          {avatarPreview && (
            <button
              type="button"
              onClick={() => {
                setAvatarPreview("");
                setAvatarFile(null);
              }}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center cursor-pointer "
              aria-label="Remove photo"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Profile Photo</p>
          <p className="text-xs text-muted-foreground mb-2">
            JPG, PNG or WebP, max 5MB
          </p>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setAvatarFile(f);
              setAvatarPreview(URL.createObjectURL(f));
            }}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => avatarInputRef.current?.click()}
            className="cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload Photo
          </Button>
        </div>
      </div>

      {/* Fields */}
      <div className="w-full p-5 rounded-xl border border-border bg-card space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Personal Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full Name" className="col-span-2">
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ahmed Al-Rashidi"
            />
          </Field>
          <Field label="Username">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ahmed_hse"
            />
          </Field>
          <Field label="Phone">
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+966 5x xxx xxxx"
            />
          </Field>
          <Field label="Gender">
            <Select
              value={gender}
              
              onValueChange={(v: string | null) => {
                if (v) setGender(v);
                
              }}
              
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male" className="cursor-pointer">Male</SelectItem>
                <SelectItem value="female" className="cursor-pointer">Female</SelectItem>
                <SelectItem value="prefer_not_to_say" className="cursor-pointer">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Location">
            <Select
              value={location}
              onValueChange={(v: string | null) => {
                if (v) setLocation(v);
              }}
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent >
                {LOCATIONS.map((l) => (
                  <SelectItem key={l} value={l} className="cursor-pointer">
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      {/* Seeker: Profession + CV */}
      {isSeeker && (
        <div className="w-full p-5 rounded-xl border border-border bg-card space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Professional Info
          </h2>
          <Field label="Profession">
            <Select
              value={profession}
              onValueChange={(v: string | null) => {
                if (v) setProfession(v);
              }}
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Your profession" />
              </SelectTrigger>
              <SelectContent style={{width:"200px"}}>
                {PROFESSIONS.map((p) => (
                  <SelectItem key={p} value={p} className="cursor-pointer">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="CV / Resume">
            <label
              className={cn(
                "flex items-center gap-3 h-11 px-3 rounded-lg border border-dashed cursor-pointer transition-colors",
                "border-border hover:border-primary/50 hover:bg-primary/5",
                cvFile && "border-primary/40 bg-primary/5"
              )}
            >
              <input
                ref={cvInputRef}
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setCvFile(f);
                }}
              />
              <Upload className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground truncate">
                {cvFile
                  ? cvFile.name
                  : initialProfile.cv_url
                  ? "CV uploaded — click to replace"
                  : "Upload CV (PDF, max 10MB)"}
              </span>
              {cvFile && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setCvFile(null);
                  }}
                  className="ml-auto"
                  aria-label="Remove CV"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              )}
            </label>
          </Field>
        </div>
      )}

      {/* Employer: Company details */}
      {!isSeeker && (
        <div className="w-full p-5 rounded-xl border border-border bg-card space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Company Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Company CR Number" className="col-span-2">
              <Input
                value={companyCr}
                onChange={(e) => setCompanyCr(e.target.value)}
                placeholder="e.g. 1010123456"
              />
            </Field>
            <Field label="Company Website" className="col-span-2">
              <Input
                type="url"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                placeholder="https://company.com"
              />
            </Field>
            <Field label="Company Address" className="col-span-2">
              <Input
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="Street, City, Country"
              />
            </Field>
          </div>
        </div>
      )}

      <Button
        size="lg"
        className="h-11"
        disabled={isLoading}
        onClick={handleSave}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        Save Changes
      </Button>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );
}
