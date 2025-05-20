"use server";

import { revalidatePath } from "next/cache";
import client from "../client";

export async function reserveSeat(concertId: string) {
  const res = await client.POST("/user/concert/{id}/reservation/reserve", {
    params: {
      path: {
        id: concertId,
      },
    },
  });

  if (res.error) {
    return {
      status: "error",
      message: res.error.message,
    };
  }
  revalidatePath("/");
  revalidatePath("/history");
  return {
    status: "success",
    message: "Reserved seat successfully",
  };
}

export async function cancelReservation(concertId: string) {
  const res = await client.POST("/user/concert/{id}/reservation/cancel", {
    params: {
      path: {
        id: concertId,
      },
    },
  });
  if (res.error) {
    return {
      status: "error",
      message: res.error.message,
    };
  }

  revalidatePath("/");
  revalidatePath("/history");
  return {
    status: "success",
    message: "Canceled reservation successfully",
  };
}
