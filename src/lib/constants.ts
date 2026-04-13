export const JOB_CATEGORIES = [
  "Safety & HSE",
  "Civil Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Project Management",
  "IT & Technology",
  "Accounting & Finance",
  "Human Resources",
  "Transportation",
  "Healthcare",
  "Other",
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];

export const LOCATIONS = [
  "Saudi Arabia",
  "UAE",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Egypt",
  "Jordan",
  "Lebanon",
  "UK",
  "USA",
  "Canada",
  "Australia",
  "Pakistan",
  "India",
  "Philippines",
  "Other",
] as const;

export type Location = (typeof LOCATIONS)[number];

export const DURATIONS = [
  "3 months",
  "6 months",
  "12 months",
  "18 months",
  "24 months",
  "36 months",
  "Permanent",
] as const;

export const PROFESSIONS = [
  "HSE Engineer",
  "Civil Engineer",
  "Electrical Engineer",
  "Mechanical Engineer",
  "Project Manager",
  "Site Supervisor",
  "Safety Officer",
  "IT Specialist",
  "Accountant",
  "HR Manager",
  "Driver",
  "Technician",
  "Other",
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  "Safety & HSE":
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Civil Engineering":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Electrical Engineering":
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Mechanical Engineering":
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Project Management":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "IT & Technology":
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "Accounting & Finance":
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Human Resources":
    "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  Transportation:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  Healthcare:
    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Other:
    "bg-muted text-muted-foreground",
};

export const ARTICLE_CATEGORIES = [
  { value: "safety_hse", label: "Safety & HSE" },
  { value: "engineering", label: "Engineering" },
  { value: "career_tips", label: "Career Tips" },
] as const;

export type ArticleCategoryValue = (typeof ARTICLE_CATEGORIES)[number]["value"];

export const ARTICLE_CATEGORY_COLORS: Record<string, string> = {
  safety_hse:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  engineering:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  career_tips:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

export const LISTING_CATEGORIES = [
  { value: "accommodation", label: "Accommodation" },
  { value: "vehicles", label: "Vehicles" },
  { value: "electronics", label: "Electronics" },
  { value: "services", label: "Services" },
  { value: "other", label: "Other" },
] as const;

export type ListingCategoryValue = (typeof LISTING_CATEGORIES)[number]["value"];

export const LISTING_CURRENCIES = ["SAR", "AED", "QAR", "KWD", "BHD", "OMR", "EGP", "USD", "GBP"] as const;

export const LISTING_CATEGORY_COLORS: Record<string, string> = {
  accommodation: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  vehicles: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  electronics: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  services: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  other: "bg-muted text-muted-foreground",
};
