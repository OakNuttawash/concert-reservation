import { UserConcertCard } from "@/components/UserConcertCard";

export default async function Home() {
  return (
    <div className="flex flex-col h-full py-10 px-6 gap-6">
      <UserConcertCard mode="reserve" />
      <UserConcertCard mode="cancel" />
    </div>
  );
}
