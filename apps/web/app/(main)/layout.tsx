"use client";

import { useRole } from "@/components/providers/RoleProvider";

export default function Layout({
  user,
  admin,
}: {
  user: React.ReactNode;
  admin: React.ReactNode;
}) {
  const { role } = useRole();
  return role === "Admin" ? admin : user;
}
