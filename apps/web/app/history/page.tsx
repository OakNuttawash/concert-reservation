"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function History() {
  return (
    <div className="flex flex-col h-full py-10 px-6 gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date time</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Concert Name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>2025-01-01 12:00:00</TableCell>
              <TableCell>John Doe</TableCell>
              <TableCell>Concert Name</TableCell>
              <TableCell>Reserve</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
