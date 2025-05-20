import client from "@/api/client";
import { AdminConcertCard } from "@/components/AdminConcertCard";
import { CreateConcertCard } from "@/components/CreateConcertCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, CircleX, User } from "lucide-react";

export default async function Home() {
  const { data: dashboardData } = await client.GET("/admin/concert/dashboard");

  const { data: concertData } = await client.GET("/admin/concert");
  return (
    <div className="flex flex-col h-full py-10 px-6 gap-6">
      <div className="flex flex-row justify-between gap-5 max-md:flex-col">
        <div className="flex flex-col px-4 py-6 gap-4 bg-primary-dark w-full text-white items-center justify-center rounded-sm">
          <div className="flex flex-col items-center justify-center gap-2">
            <User size="40px" strokeWidth="1px" />
            <h5>Total of seats</h5>
          </div>
          <h2>{dashboardData?.totalSeats}</h2>
        </div>
        <div className="flex flex-col px-4 py-6 gap-4 bg-success w-full text-white items-center justify-center rounded-sm">
          <div className="flex flex-col items-center justify-center gap-2">
            <Award size="40px" strokeWidth="1px" />
            <h5>Reserve</h5>
          </div>
          <h2>{dashboardData?.totalReserveReservation}</h2>
        </div>
        <div className="flex flex-col px-4 py-6 gap-4 bg-destructive w-full text-white items-center justify-center rounded-sm">
          <div className="flex flex-col items-center justify-center gap-2">
            <CircleX size="40px" strokeWidth="1px" />
            <h5>Cancel</h5>
          </div>
          <h2>{dashboardData?.totalCancelReservation}</h2>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">
            <h5>Overview</h5>
          </TabsTrigger>
          <TabsTrigger value="create">
            <h5>Create</h5>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="flex flex-col gap-2">
            {concertData?.length === 0 ? (
              <h5 className="self-center">No concert found</h5>
            ) : (
              concertData?.map((concert) => (
                <AdminConcertCard key={concert.id} concert={concert} />
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="create">
          <CreateConcertCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
