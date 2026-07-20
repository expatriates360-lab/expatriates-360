import {
  Briefcase, Users, GraduationCap, Wrench, Home, ShoppingBag, Newspaper
} from "lucide-react";

export const CREATE_AD_CATEGORIES = [
  { id: "careers", label: "Careers", icon: Briefcase, href: "/create?type=careers" },
  { id: "temp-work", label: "Temp Work", icon: Users, href: "/create?type=temp-work" },
  { id: "learning", label: "Learning Hub", icon: GraduationCap, href: "/create?type=learning" },
  { id: "services", label: "Services", icon: Wrench, href: "/create?type=services" },
  { id: "property", label: "Property", icon: Home, href: "/create?type=property" },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag, href: "/create?type=marketplace" },
  { id: "community", label: "Community", icon: Newspaper, href: "/create?type=community" },
];