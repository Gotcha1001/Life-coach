"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  BookOpen,
  Sparkles,
  History,
  Home,
  ChevronLeft,
  ChevronRight,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard/plan", icon: Home, label: "Plan" },
  { href: "/dashboard/checkin", icon: Sparkles, label: "CheckIn" },
  { href: "/dashboard/history", icon: History, label: "History" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <motion.aside
      initial={{ width: 240 }}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sidebar relative flex flex-col h-screen z-50 shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-purple-900/35">
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-mystical">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div className="absolute inset-0 rounded-full animate-pulse-glow opacity-50" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-serif text-sm font-bold text-purple-200 leading-tight">
                Wizardry
              </p>
              <p className="font-serif text-xs text-purple-400 leading-tight">
                Insights
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 4 }}
                className={cn(
                  "sidebar-item flex items-center gap-3 px-3 py-3 cursor-pointer",
                  active && "active",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 shrink-0",
                    active ? "text-fuchsia-300" : "text-purple-400",
                  )}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className={cn(
                        "text-sm font-medium whitespace-nowrap font-body",
                        active ? "text-fuchsia-200" : "text-purple-300",
                      )}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mystical-divider mx-3 mb-3" />

      {/* User */}
      <div className="px-3 pb-4 flex items-center gap-3">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-9 h-9 ring-2 ring-purple-500/50",
            },
          }}
        />
        <AnimatePresence>
          {!collapsed && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-w-0"
            >
              <p className="text-xs text-purple-200 font-medium truncate">
                {user.firstName || "Seeker"}
              </p>
              <p className="text-xs text-purple-500 truncate">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-purple-900 border border-purple-700 flex items-center justify-center text-purple-300 hover:text-fuchsia-300 hover:border-fuchsia-500 transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </motion.aside>
  );
}
