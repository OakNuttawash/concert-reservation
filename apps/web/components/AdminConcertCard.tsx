"use client";

import { deleteConcert } from "@/api/concert/action";
import { components } from "@/api/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Trash2, User, XCircle } from "lucide-react";
import { startTransition } from "react";
import { toast } from "./ui/use-toast";

interface ConcertCardProps {
  concert: components["schemas"]["GetAdminConcertDto"];
}

export function AdminConcertCard(props: ConcertCardProps) {
  const { concert } = props;

  async function onSubmit() {
    startTransition(async () => {
      const res = await deleteConcert(String(concert.id));
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
        description: "Concert has been deleted",
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
      <h5 className="leading-6">{concert.description}</h5>
      <div className="flex flex-row justify-between gap-4 items-center">
        <div className="flex flex-row gap-2 items-center">
          <User />
          <h5>{concert.totalSeat}</h5>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="text-white" />
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent className="gap-8">
            <DialogHeader className="space-y-6">
              <DialogTitle className="self-center">
                <XCircle size="48px" fill="red" color="white" />
              </DialogTitle>
              <div className="text-black self-center text-center font-bold space-y-2">
                <h4 className="text-base">Are you sure to delete?</h4>
                <h4 className="text-base">&ldquo;{concert.name}&rdquo;</h4>
              </div>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  className="md:w-1/2 grow"
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="destructive"
                className="md:w-1/2 grow"
                onClick={onSubmit}
              >
                Yes, Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
