"use client";

import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarRoot,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Home, Inbox, LogOut, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Role = "Admin" | "User";

const sidebarItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "History",
    url: "/history",
    icon: Inbox,
  },
];

interface SidebarProps {
  role: Role;
  setRole: (role: Role) => void;
}

function SidebarBaseContent(props: SidebarProps) {
  const { role, setRole } = props;
  const location = usePathname();
  const { setOpenMobile } = useSidebar();

  const router = useRouter();
  return (
    <SidebarRoot>
      <SidebarContent>
        <SidebarGroup className="space-y-3">
          <h3 className="font-semibold leading-[1.5] py-6 px-4">{role}</h3>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {role === "Admin" &&
                sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "px-2 py-6 space-x-2.5 rounded-sm",
                        location === item.url ? "bg-primary-light" : ""
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon size="24px" />
                        <h5>{item.title}</h5>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="px-2 py-6 space-x-2.5 rounded-sm"
                >
                  <Link
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setRole(role === "Admin" ? "User" : "Admin");
                      setOpenMobile(false);
                      router.push("/");
                    }}
                  >
                    <RefreshCcw />
                    <h5>Switch to {role === "Admin" ? "User" : "Admin"}</h5>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="px-2 py-6 space-x-2.5 rounded-sm"
            >
              <Link href="/">
                <LogOut />
                <h5>Sign out</h5>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarRoot>
  );
}

function SidebarMobile(props: SidebarProps) {
  const { role, setRole } = props;
  return (
    <>
      <div className="shadow-md w-full flex items-center px-4 py-2 justify-between sticky top-0 z-50 bg-white">
        <SidebarTrigger className="-ml-1" />
        <h5 className="font-bold">{role}</h5>
      </div>
      <SidebarBaseContent role={role} setRole={setRole} />
    </>
  );
}

export function Sidebar() {
  const isMobile = useIsMobile();
  const [role, setRole] = useState<Role>("Admin");

  if (isMobile) {
    return <SidebarMobile role={role} setRole={setRole} />;
  }

  return <SidebarBaseContent role={role} setRole={setRole} />;
}
