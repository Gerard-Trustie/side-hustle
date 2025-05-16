"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import {
  LayoutDashboard,
  Search,
  PenTool,
  Send,
  PiggyBank,
} from "lucide-react";

export const MenuDrawer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/home",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4 mr-2" />,
    },
    {
      href: "/user-search",
      label: "User Search",
      icon: <Search className="w-4 h-4 mr-2" />,
    },
    {
      href: "/create-post",
      label: "Create Post",
      icon: <PenTool className="w-4 h-4 mr-2" />,
    },
    {
      href: "/publish-post",
      label: "Publish Post",
      icon: <Send className="w-4 h-4 mr-2" />,
    },
    {
      href: "/knowledge",
      label: "Knowledge Base",
      icon: <PiggyBank className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <div className="flex h-screen">
      <div className="bg-primary200 w-64 space-y-6 py-7 px-2 h-full">
        <ModeToggle />
        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center py-2.5 px-4 rounded transition duration-200 ${
                pathname === item.href
                  ? "bg-primary500 text-white"
                  : "text-gray-900 hover:text-primary500"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-primary200">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
