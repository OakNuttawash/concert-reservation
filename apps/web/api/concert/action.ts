"use server";

import { concertSchema } from "@/lib/schema/concertSchema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import client from "../client";

export async function createConcert(data: z.infer<typeof concertSchema>) {
  const result = concertSchema.safeParse(data);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.message,
    };
  }

  const createConcert = client.POST("/admin/concert", {
    body: {
      name: data.name,
      totalSeat: Number(data.totalSeat),
      description: data.description,
    },
  });

  const res = await createConcert;

  if (res.error) {
    return {
      status: "error",
      message: res.error.message,
    };
  }
  revalidatePath("/");
  return {
    status: "success",
    message: "Concert created successfully",
  };
}

export async function deleteConcert(concertId: string) {
  const deleteConcert = client.DELETE("/admin/concert/{id}", {
    params: {
      path: {
        id: concertId,
      },
    },
  });

  const res = await deleteConcert;
  if (res.error) {
    return {
      status: "error",
      message: res.error.message,
    };
  }
  revalidatePath("/");
  return {
    status: "success",
    message: "Concert deleted successfully",
  };
}
