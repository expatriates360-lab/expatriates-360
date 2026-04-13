"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Plus,
  Users,
  Globe,
  Menu,
  ChevronRight,
  BookOpen,
  ShieldCheck,
  ShoppingBag,
  PackageOpen,
  Megaphone,
  DatabaseBackup,
  Sun,
  Moon,
} from "lucide-react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/database";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}

function getNavItems(role: UserRole): NavItem[] {
  if (role === "employer") {
    return [
      {
        href: "/dashboard",
        label: "Overview",
        icon: <LayoutDashboard className="h-4 w-4" />,
        exact: true,
      },
      {
        href: "/dashboard/jobs",
        label: "My Job Posts",
        icon: <Briefcase className="h-4 w-4" />,
      },
      {
        href: "/dashboard/jobs/new",
        label: "Post a Job",
        icon: <Plus className="h-4 w-4" />,
      },
      {
        href: "/dashboard/profile",
        label: "Company Profile",
        icon: <User className="h-4 w-4" />,
      },
      {
        href: "/candidates",
        label: "Browse Candidates",
        icon: <Users className="h-4 w-4" />,
      },
      {
        href: "/dashboard/articles",
        label: "My Articles",
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        href: "/dashboard/market",
        label: "My Listings",
        icon: <ShoppingBag className="h-4 w-4" />,
        exact: true,
      },
      {
        href: "/dashboard/market/orders",
        label: "Incoming Orders",
        icon: <PackageOpen className="h-4 w-4" />,
      },
    ];
  }

  if (role === "admin") {
    return [
      {
        href: "/dashboard",
        label: "Overview",
        icon: <LayoutDashboard className="h-4 w-4" />,
        exact: true,
      },
      {
        href: "/dashboard/admin/users",
        label: "Users",
        icon: <Users className="h-4 w-4" />,
      },
      {
        href: "/dashboard/admin/jobs",
        label: "Job Queue",
        icon: <Briefcase className="h-4 w-4" />,
      },
      {
        href: "/dashboard/admin/articles",
        label: "Articles",
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        href: "/dashboard/admin/market",
        label: "Marketplace",
        icon: <ShoppingBag className="h-4 w-4" />,
      },
      {
        href: "/dashboard/admin/security",
        label: "Security",
        icon: <ShieldCheck className="h-4 w-4" />,
      },
      {
        href: "/dashboard/admin/ads",
        label: "Ads",
        icon: <Megaphone className="h-4 w-4" />,
      },
      {
        href: "/dashboard/admin/backups",
        label: "Backups",
        icon: <DatabaseBackup className="h-4 w-4" />,
      },
    ];
  }

  // seeker (default)
  return [
    {
      href: "/dashboard",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
      exact: true,
    },
    {
      href: "/dashboard/profile",
      label: "My Profile",
      icon: <User className="h-4 w-4" />,
    },
    {
      href: "/jobs",
      label: "Browse Jobs",
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      href: "/candidates",
      label: "Browse Candidates",
      icon: <Users className="h-4 w-4" />,
    },
    {
      href: "/dashboard/articles",
      label: "My Articles",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      href: "/dashboard/market",
      label: "My Listings",
      icon: <ShoppingBag className="h-4 w-4" />,
      exact: true,
    },
    {
      href: "/dashboard/market/orders",
      label: "Incoming Orders",
      icon: <PackageOpen className="h-4 w-4" />,
    },
  ];
}

function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}

interface SidebarContentProps {
  role: UserRole;
  fullName: string;
  navItems: NavItem[];
  pathname: string;
  onNavClick?: () => void;
}

function SidebarContent({
  role,
  fullName,
  navItems,
  pathname,
  onNavClick,
}: SidebarContentProps) {
  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-5 h-16 border-b border-border shrink-0">
        <Image
          src="/assets/logo new.png"
          alt="Expatriates 360"
          width={130}
          height={36}
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(item)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.icon}
            {item.label}
            {isActive(item) && (
              <ChevronRight className="ml-auto h-4 w-4 opacity-40" />
            )}
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-border shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <UserButton />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {fullName}
            </p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
          <ThemeToggleButton />
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Globe className="h-3.5 w-3.5" />
          Back to site
        </Link>
      </div>
    </div>
  );
}

export interface DashboardShellProps {
  role: UserRole;
  fullName: string;
  children: React.ReactNode;
}

export function DashboardShell({ role, fullName, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const navItems = getNavItems(role);

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] shrink-0 bg-card border-r border-border fixed inset-y-0 left-0 z-30">
        <SidebarContent
          role={role}
          fullName={fullName}
          navItems={navItems}
          pathname={pathname}
        />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-[240px] bg-card border-r border-border transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          role={role}
          fullName={fullName}
          navItems={navItems}
          pathname={pathname}
          onNavClick={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-card/80 backdrop-blur border-b border-border">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold text-sm gradient-text flex-1">
            Expatriates 360
          </span>
          <UserButton />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
