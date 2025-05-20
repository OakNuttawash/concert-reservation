import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Trash2, User, XCircle } from "lucide-react";

interface ConcertCardProps {
  mode: "reserve" | "cancel" | "delete";
}

export function ConcertCard(props: ConcertCardProps) {
  const { mode } = props;
  return (
    <div className="flex flex-col p-10 gap-8 rounded-sm border bg-white border-gray-200">
      <div className="flex flex-col gap-6">
        <h4 className="font-semibold text-primary">Concert 1</h4>
        <Separator />
      </div>
      <h5 className="leading-6 break-all">
        testtesttesttesttesttesttesttesttesttest
        testtesttesttesttesttesttesttesttesttest sttesttesttesttest
      </h5>
      <div className="flex flex-row justify-between gap-4 items-center">
        <div className="flex flex-row gap-2 items-center">
          <User />
          <h5>500</h5>
        </div>
        {mode === "reserve" && <Button>Reserve</Button>}
        {mode === "cancel" && <Button variant="destructive">Cancel</Button>}
        {mode === "delete" && (
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
                  <h4 className="text-base">&ldquo;Concert Name 2&rdquo;</h4>
                </div>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="reset"
                  className="md:w-1/2 grow"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button variant="destructive" className="md:w-1/2 grow">
                  Yes, Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
