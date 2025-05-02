"use client";
import {
  ImagePlus,
  ImagePlay,
  Home,
  UserSearch,
  Settings,
  LogOut,
  PiggyBank,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import logo from "@/assets/logo.jpg";
import { usePathname } from "next/navigation";
// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "User Search",
    url: "/user-search",
    icon: UserSearch,
  },
  {
    title: "Create Post",
    url: "/create-post",
    icon: ImagePlus,
  },
  {
    title: "Publish Post",
    url: "/publish-post",
    icon: ImagePlay,
  },
  {
    title: "Financial Knowledge",
    url: "/knowledge",
    icon: PiggyBank,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <div className="flex justify-center mb-6">
          <Image src={logo} alt="Logo" width={60} height={60} />
        </div>
        <h2 className="text-xl font-semibold mb-6 text-center">
          Trustie Admin Panel
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
