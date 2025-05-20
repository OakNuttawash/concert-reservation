import client from "@/api/client";
import { UserConcertCard } from "@/components/UserConcertCard";

export default async function Home() {
  const { data } = await client.GET("/user/concert");

  return (
    <div className="flex flex-col h-full py-10 px-6 gap-6">
      {data?.length === 0 && <h5 className="self-center">No concert found</h5>}
      {data?.map((concert) => (
        <UserConcertCard
          key={concert.id}
          mode={
            concert.reservationStatus === "NONE"
              ? "reserve"
              : concert.reservationStatus === "RESERVE"
                ? "cancel"
                : "reserve"
          }
          concert={concert}
        />
      ))}
    </div>
  );
}
