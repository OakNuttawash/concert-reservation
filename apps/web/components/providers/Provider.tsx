"use client";

import { SidebarProvider } from "@/components/ui/sidebar";

import { ReactNode } from "react";
import { RoleProvider } from "./RoleProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <RoleProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </RoleProvider>
  );
}
