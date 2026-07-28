export const JOB_CATEGORIES = [
  "Administration",
  "Accounting",
  "Banking",
  "Human Resources",
  "Electrical Technician",
  "Mechanical Technician",
  "Instrumentation Technician",
  "Piping Foreman",
  "Piping Engineering",
  "Civil Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Instrumentation Engineering",
  "Structural Engineering",
  "Rigging & Lifting",
  "Architecture",
  "Welder",
  "Electrician",
  "Quantity Surveying",
  "Planning & Scheduling",
  "Project Management",
  "Site Supervision",
  "Inspection & QA/QC",
  "Oil & Gas",
  "Painter",
  "Helper",
  "Scaffolder",
  "Marketing",
  "Digital Marketing",
  "Logistics",
  "Carpenter",
  "HVAC Technician",
  "Driver",
  "Cleaner",
  "Housekeeper",
  "Mason",
  "Tile Fixer",
  "Steel Fixer",
  "Fabricator",
  "Mechanic",
  "Forklift Operator",
  "Crane Operator",
  "Machine Operator",
  "Storekeeper",
  "Cook",
  "Security Guard",
  "Office Assistant",
  "Data Entry",
  "Transportation",
  "Hospitality",
  "Healthcare",
  "Education",
  "IT",
  "Engineering",
  "Construction",
  "Manufacturing",
  "Telecommunications",
  "Freelance",
  "Remote Jobs",
  "Safety & HSE",
  "Other",
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];

export const DURATIONS = [
  "1 Month",
  "3 Months",
  "6 Months",
  "12 Months",
  "24 Months",
  "Long Term",
  "Permanent",
] as const;

export const SALARY_TYPES = ["Hourly", "Monthly", "After Interview"] as const;
export type SalaryType = (typeof SALARY_TYPES)[number];

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

// Colors for the most common categories; anything not listed
// should fall back to the "Other" style in consuming components.
export const CATEGORY_COLORS: Record<string, string> = {
  "Safety & HSE":
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Civil Engineering":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Electrical Engineering":
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Mechanical Engineering":
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Instrumentation Engineering":
    "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "Structural Engineering":
    "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "Piping Engineering":
    "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
  "Project Management":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Oil & Gas":
    "bg-stone-100 text-stone-700 dark:bg-stone-800/60 dark:text-stone-300",
  Construction:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  IT:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Accounting:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Human Resources":
    "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  Marketing:
    "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
  "Digital Marketing":
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  Logistics:
    "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
  Transportation:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  Healthcare:
    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Education:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  Hospitality:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Engineering:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
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

export const LISTING_CURRENCIES = [
  "SAR", "PKR", "QAR", "AED", "KWD", "BHD", "USD", "EUR", "ARS", "AUD",
  "BDT", "BRL", "CAD", "CHF", "CLP", "CNY", "COP", "CZK", "DKK", "EGP",
  "ETB", "GBP", "HKD", "HUF", "IDR", "INR", "JPY", "KES", "KRW", "LKR",
  "MAD", "MXN", "MYR", "NGN", "NOK", "NPR", "NZD", "OMR", "PHP", "PLN",
  "RUB", "SEK", "SGD", "THB", "TRY", "TWD", "VND", "ZAR"
] as const; 

export const LISTING_CATEGORY_COLORS: Record<string, string> = {
  accommodation: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  vehicles: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  electronics: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  services: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  other: "bg-muted text-muted-foreground",
};
