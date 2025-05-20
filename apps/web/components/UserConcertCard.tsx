"use client";

import { cancelReservation, reserveSeat } from "@/api/reservation/actions";
import { components } from "@/api/schema";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { startTransition } from "react";
import { toast } from "./ui/use-toast";

interface ConcertCardProps {
  mode: "reserve" | "cancel" | "delete";
  concert: components["schemas"]["GetUserConcertDto"];
}

export function UserConcertCard(props: ConcertCardProps) {
  const { mode, concert } = props;

  async function ReserveSeat() {
    startTransition(async () => {
      const res = await reserveSeat(String(concert.id));
      if (res.status === "error") {
        toast({
          title: "Error",
          description: res.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: "Reservation has been made",
        variant: "success",
      });
    });
  }

  async function CancelSeat() {
    startTransition(async () => {
      const res = await cancelReservation(String(concert.id));
      if (res.status === "error") {
        toast({
          title: "Error",
          description: res.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: "Reservation has been canceled",
        variant: "success",
      });
    });
  }
  return (
    <div className="flex flex-col p-10 gap-8 rounded-sm border bg-white border-gray-200">
      <div className="flex flex-col gap-6">
        <h4 className="font-semibold text-primary">{concert.name}</h4>
        <Separator />
      </div>
      <h5 className="leading-6 break-all">{concert.description}</h5>
      <div className="flex flex-row justify-between gap-4 items-center">
        <div className="flex flex-row gap-2 items-center">
          <User />
          <h5>{concert.currentTotalSeat}</h5>
        </div>
        {mode === "reserve" && <Button onClick={ReserveSeat}>Reserve</Button>}
        {mode === "cancel" && (
          <Button onClick={CancelSeat} variant="destructive">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
