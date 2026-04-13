"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { Briefcase, User, ArrowRight, ArrowLeft, Eye, EyeOff, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import Image from "next/image";

type GoalType = "seeker" | "employer" | null;
type Step = "goal" | "account" | "profile" | "verify";

interface FormData {
  // Account
  email: string;
  password: string;
  // Shared profile
  fullName: string;
  username: string;
  phone: string;
  gender: string;
  location: string;
  // Seeker only
  profession: string;
  avatarFile: File | null;
  avatarPreview: string;
  cvFile: File | null;
  // Employer only
  companyCr: string;
  companyWebsite: string;
  companyAddress: string;
  // Verify
  code: string;
}

const LOCATIONS = [
  "Saudi Arabia", "UAE", "Qatar", "Kuwait", "Bahrain", "Oman",
  "Egypt", "Jordan", "Lebanon", "UK", "USA", "Canada", "Australia",
  "Pakistan", "India", "Philippines", "Other",
];

const PROFESSIONS = [
  "HSE Engineer", "Civil Engineer", "Electrical Engineer", "Mechanical Engineer",
  "Project Manager", "Site Supervisor", "Safety Officer", "IT Specialist",
  "Accountant", "HR Manager", "Driver", "Technician", "Other",
];

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useSignUp();

  const [goal, setGoal] = useState<GoalType>(null);
  const [step, setStep] = useState<Step>("goal");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<FormData>({
    email: "", password: "", fullName: "", username: "", phone: "",
    gender: "", location: "", profession: "", avatarFile: null,
    avatarPreview: "", cvFile: null, companyCr: "", companyWebsite: "",
    companyAddress: "", code: "",
  });

  const set = (field: keyof FormData, value: string | File | null) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // ── Step: Account creation ────────────────────────────────
  async function handleCreateAccount() {
    if (!goal) return;
    setIsLoading(true);
    try {
      const { error: createErr } = await signUp.create({
        emailAddress: form.email,
        password: form.password,
        unsafeMetadata: { role: goal },
      });
      if (createErr) { toast.error(createErr.longMessage ?? createErr.message ?? "Account creation failed."); return; }
      const { error: emailErr } = await signUp.verifications.sendEmailCode();
      if (emailErr) { toast.error(emailErr.longMessage ?? emailErr.message ?? "Could not send verification code."); return; }
      setStep("verify");
    } catch (err: unknown) {
      toast.error((err as Error)?.message ?? "Account creation failed.");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Step: Email verification ──────────────────────────────
  async function handleVerify() {
    setIsLoading(true);
    try {
      const { error: verifyErr } = await signUp.verifications.verifyEmailCode({ code: form.code });
      if (verifyErr) { toast.error(verifyErr.longMessage ?? verifyErr.message ?? "Verification failed."); return; }
      if (signUp.status === "complete") {
        const { error: finalizeErr } = await signUp.finalize();
        if (finalizeErr) { toast.error(finalizeErr.longMessage ?? finalizeErr.message ?? "Sign-up could not be finalized."); return; }
        setStep("profile");
      }
    } catch (err: unknown) {
      toast.error((err as Error)?.message ?? "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Step: Profile save (calls our API) ───────────────────
  async function handleSaveProfile() {
    setIsLoading(true);
    try {
      let avatarUrl: string | null = null;
      let avatarPublicId: string | null = null;
      let cvStoragePath: string | null = null;

      // Upload avatar to Cloudinary
      if (form.avatarFile) {
        const { url, publicId } = await uploadToCloudinary(
          form.avatarFile,
          "expatriates360/avatars"
        );
        avatarUrl = url;
        avatarPublicId = publicId;
      }

      // Upload CV to Cloudinary using the docs preset
      if (form.cvFile && goal === "seeker") {
        const { url } = await uploadToCloudinary(
          form.cvFile,
          "expatriates360/cvs",
          {
            preset: process.env.NEXT_PUBLIC_CLOUDINARY_DOCS_PRESET,
            resourceType: "auto",
          }
        );
        cvStoragePath = url;
      }

      // Save profile via API
      const res = await fetch("/api/profile/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: goal,
          fullName: form.fullName,
          username: form.username,
          phone: form.phone,
          gender: form.gender,
          location: form.location,
          profession: goal === "seeker" ? form.profession : null,
          avatarUrl,
          avatarPublicId,
          cvUrl: cvStoragePath,
          companyCr: goal === "employer" ? form.companyCr : null,
          companyWebsite: goal === "employer" ? form.companyWebsite : null,
          companyAddress: goal === "employer" ? form.companyAddress : null,
        }),
      });

      if (!res.ok) throw new Error("Profile save failed");

      toast.success("Profile created! Welcome to Expatriates 360.");
      router.push(goal === "seeker" ? "/candidates" : "/jobs");
    } catch (err: unknown) {
      toast.error((err as Error).message ?? "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      {/* Background blobs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-20 h-[500px] w-[500px] rounded-full bg-[var(--brand-from)] opacity-[0.07] blur-3xl" />
        <div className="absolute bottom-0 -left-20 h-[400px] w-[400px] rounded-full bg-[var(--brand-via)] opacity-[0.06] blur-3xl" />
      </div>

      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/assets/logo new.png"
                alt="Expatriates 360"
                width={160}
                height={48}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>
        </div>

        {/* ── STEP: Goal ── */}
        {step === "goal" && (
          <div className="space-y-6 text-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">What&apos;s your goal?</h1>
              <p className="text-muted-foreground mt-1 text-sm">Choose how you want to use Expatriates 360</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <GoalCard
                icon={<User className="h-7 w-7" />}
                title="Job Seeker"
                description="Find your next opportunity abroad"
                selected={goal === "seeker"}
                onClick={() => setGoal("seeker")}
              />
              <GoalCard
                icon={<Briefcase className="h-7 w-7" />}
                title="Employer"
                description="Post jobs & find top talent"
                selected={goal === "employer"}
                onClick={() => setGoal("employer")}
              />
            </div>
            <Button
              size="lg"
              className="w-full h-11"
              disabled={!goal}
              onClick={() => setStep("account")}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* ── STEP: Account ── */}
        {step === "account" && (
          <FormCard
            title="Create your account"
            subtitle={`Registering as a ${goal === "seeker" ? "Job Seeker" : "Employer"}`}
            onBack={() => setStep("goal")}
          >
            <div className="space-y-4">
              <Field label="Email address">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  required
                />
              </Field>
              <Field label="Password">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>
              {/* Required by Clerk Smart CAPTCHA bot protection */}
              <div id="clerk-captcha" />
              <Button
                className="w-full h-11"
                disabled={!form.email || !form.password || isLoading}
                onClick={handleCreateAccount}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Account
              </Button>
            </div>
          </FormCard>
        )}

        {/* ── STEP: Verify ── */}
        {step === "verify" && (
          <FormCard
            title="Check your email"
            subtitle={`We sent a 6-digit code to ${form.email}`}
            onBack={() => setStep("account")}
          >
            <div className="space-y-4">
              <Field label="Verification code">
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  className="text-center text-xl tracking-[0.4em] font-mono h-14"
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.replace(/\D/g, ""))}
                />
              </Field>
              <Button
                className="w-full h-11"
                disabled={form.code.length !== 6 || isLoading}
                onClick={handleVerify}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Verify & Continue
              </Button>
            </div>
          </FormCard>
        )}

        {/* ── STEP: Profile ── */}
        {step === "profile" && goal === "seeker" && (
          <FormCard
            title="Complete your profile"
            subtitle="This information will appear on your public candidate card"
          >
            <div className="space-y-4">
              {/* Avatar upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-20 w-20">
                  {form.avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.avatarPreview}
                      alt="Avatar preview"
                      className="h-20 w-20 rounded-full object-cover border-2 border-primary/30"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  {form.avatarPreview && (
                    <button
                      type="button"
                      onClick={() => { set("avatarFile", null); set("avatarPreview", ""); }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center"
                      aria-label="Remove photo"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      set("avatarFile", f);
                      set("avatarPreview", URL.createObjectURL(f));
                    }}
                  />
                  <span className="text-xs text-primary hover:underline flex items-center gap-1.5">
                    <Upload className="h-3.5 w-3.5" /> Upload Photo
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Full Name" className="col-span-2">
                  <Input placeholder="Ahmed Al-Rashidi" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required />
                </Field>
                <Field label="Username">
                  <Input placeholder="ahmed_hse" value={form.username} onChange={(e) => set("username", e.target.value)} />
                </Field>
                <Field label="Phone">
                  <Input placeholder="+966 5x xxx xxxx" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </Field>
                <Field label="Gender">
                  <Select onValueChange={(v: string | null) => { if (v) set("gender", v); }}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Location">
                  <Select onValueChange={(v: string | null) => { if (v) set("location", v); }}>
                    <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Profession" className="col-span-2">
                  <Select onValueChange={(v: string | null) => { if (v) set("profession", v); }}>
                    <SelectTrigger><SelectValue placeholder="Your profession" /></SelectTrigger>
                    <SelectContent>
                      {PROFESSIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {/* CV Upload */}
              <Field label="CV / Resume (PDF only)">
                <label className={cn(
                  "flex items-center gap-3 h-11 px-3 rounded-lg border border-dashed cursor-pointer transition-colors",
                  "border-border hover:border-primary/50 hover:bg-primary/5",
                  form.cvFile && "border-primary/40 bg-primary/5"
                )}>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) set("cvFile", f);
                    }}
                  />
                  <Upload className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground truncate">
                    {form.cvFile ? form.cvFile.name : "Click to upload your CV (PDF, max 10MB)"}
                  </span>
                  {form.cvFile && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); set("cvFile", null); }}
                      className="ml-auto shrink-0"
                      aria-label="Remove CV"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  )}
                </label>
              </Field>

              <Button
                className="w-full h-11 mt-2"
                disabled={!form.fullName || isLoading}
                onClick={handleSaveProfile}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Complete Registration
              </Button>
            </div>
          </FormCard>
        )}

        {step === "profile" && goal === "employer" && (
          <FormCard
            title="Company details"
            subtitle="Tell us about the company you're hiring for"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Full Name" className="col-span-2">
                  <Input placeholder="John Smith" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required />
                </Field>
                <Field label="Username">
                  <Input placeholder="johnsmith" value={form.username} onChange={(e) => set("username", e.target.value)} />
                </Field>
                <Field label="Phone">
                  <Input placeholder="+966 1x xxx xxxx" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </Field>
                <Field label="Gender">
                  <Select onValueChange={(v: string | null) => { if (v) set("gender", v); }}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Location">
                  <Select onValueChange={(v: string | null) => { if (v) set("location", v); }}>
                    <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Company CR Number" className="col-span-2">
                  <Input placeholder="e.g. 1010123456" value={form.companyCr} onChange={(e) => set("companyCr", e.target.value)} />
                </Field>
                <Field label="Company Website" className="col-span-2">
                  <Input placeholder="https://company.com" type="url" value={form.companyWebsite} onChange={(e) => set("companyWebsite", e.target.value)} />
                </Field>
                <Field label="Company Address" className="col-span-2">
                  <Input placeholder="Street, City, Country" value={form.companyAddress} onChange={(e) => set("companyAddress", e.target.value)} />
                </Field>
              </div>

              <Button
                className="w-full h-11 mt-2"
                disabled={!form.fullName || isLoading}
                onClick={handleSaveProfile}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Complete Registration
              </Button>
            </div>
          </FormCard>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function GoalCard({
  icon, title, description, selected, onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-all duration-200",
        selected
          ? "border-primary bg-primary/8 shadow-sm"
          : "border-border hover:border-primary/40 hover:bg-muted/50"
      )}
    >
      <div className={cn(
        "flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-200",
        selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        {icon}
      </div>
      <div>
        <p className={cn("font-semibold", selected ? "text-primary" : "text-foreground")}>{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </button>
  );
}

function FormCard({
  title, subtitle, onBack, children,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
      <div className="space-y-1">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        )}
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({
  label, children, className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</Label>
      {children}
    </div>
  );
}
