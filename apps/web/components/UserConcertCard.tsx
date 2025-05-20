import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";

interface ConcertCardProps {
  mode: "reserve" | "cancel" | "delete";
}

export function UserConcertCard(props: ConcertCardProps) {
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
      </div>
    </div>
  );
}
