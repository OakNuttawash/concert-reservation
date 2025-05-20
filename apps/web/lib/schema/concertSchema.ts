import { z } from "zod";

export const concertSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  totalSeat: z.string().min(1, { message: "Total seat is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});
